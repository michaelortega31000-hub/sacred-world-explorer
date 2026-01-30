
# Plan: Enrich Sacred Places Data with Verified Internet Sources

## Understanding Your Request

You want to:
1. **Find reliable information** about sacred monuments, cathedrals, temples from trusted internet sources
2. **Verify the data is accurate** before adding it to the application
3. **Expand the database** with new places that aren't currently in the app

---

## Current State

- **200+ sacred places** already in `placesData.ts` with curated descriptions
- Data is manually written and verified
- Database has a `places` table ready to store new places
- No automated data enrichment system exists yet

---

## Proposed Solution: Two-Tier Data Enrichment

### Option A: Admin-Curated Enrichment (Recommended - Most Accurate)

Create an **admin interface** where you can:
1. Search for a sacred place using web search (Perplexity or Firecrawl)
2. Review the sources and verify accuracy
3. Edit and approve the description before saving to database
4. Mark the source as verified (Wikipedia, UNESCO, official site)

```text
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DATA ENRICHMENT                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Search: "Hagia Sophia Istanbul" ]  [🔎 Search Web]             │
│                                                                  │
│  ─────────────────────────────────────────────────────────────   │
│  SOURCES FOUND:                                                  │
│                                                                  │
│  📖 Wikipedia (en.wikipedia.org)                                 │
│  ✓ "Built 537 AD by Emperor Justinian I..."                      │
│                                                                  │
│  🏛️ UNESCO World Heritage (whc.unesco.org)                       │
│  ✓ "Outstanding universal value... Byzantine architecture..."   │
│                                                                  │
│  🏫 Official Site (ayasofyamuzesi.gov.tr)                        │
│  ✓ "Museum hours: 9am-7pm..."                                    │
│                                                                  │
│  ─────────────────────────────────────────────────────────────   │
│  COMPILED DESCRIPTION:                                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Hagia Sophia, built in 537 AD under Emperor Justinian I,  │  │
│  │ was the world's largest cathedral for nearly 1000 years.  │  │
│  │ Originally a Byzantine church, converted to mosque in     │  │
│  │ 1453, museum in 1934, and mosque again in 2020...          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Sources: ☑ Wikipedia  ☑ UNESCO  ☑ Official                      │
│  Verified by: Admin                                              │
│                                                                  │
│  [Save to Database]  [Discard]                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Benefits:**
- Human verification ensures 100% accuracy
- Sources are tracked and can be cited
- No hallucinations possible - only approved data enters the system

---

### Option B: Automated Enrichment with Citations (Faster but requires review)

Use **Perplexity API** (search with citations) to automatically gather information, then store with source URLs for verification:

```text
User adds: "Angkor Wat, Cambodia"
     ↓
System calls Perplexity search API
     ↓
Returns: {
  content: "Angkor Wat is a Hindu-Buddhist temple complex...",
  citations: [
    "https://whc.unesco.org/en/list/668",
    "https://en.wikipedia.org/wiki/Angkor_Wat"
  ]
}
     ↓
Stored with sources for admin review
     ↓
Admin approves → data becomes active
```

---

## Technical Implementation

### Step 1: Connect Perplexity or Firecrawl

We can use connectors to access web search with citations:

| Connector | Purpose | Accuracy |
|-----------|---------|----------|
| **Perplexity** | AI search with source citations | High - cites reliable sources |
| **Firecrawl** | Scrape specific sites (Wikipedia, UNESCO) | Very High - exact source content |

### Step 2: Database Schema Update

Add source tracking to the places table:

```sql
ALTER TABLE places ADD COLUMN IF NOT EXISTS source_urls TEXT[];
ALTER TABLE places ADD COLUMN IF NOT EXISTS verified_by UUID;
ALTER TABLE places ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE places ADD COLUMN IF NOT EXISTS data_source TEXT; -- 'manual', 'wikipedia', 'unesco', 'perplexity'
```

### Step 3: Create Admin Enrichment Page

New admin page for data curation:

```text
/admin/enrich-data
  ├── Search web for place information
  ├── Display sources with citations
  ├── Allow editing before saving
  └── Track verification status
```

### Step 4: Edge Function for Web Search

Create `enrich-place-data` edge function:

```typescript
// supabase/functions/enrich-place-data/index.ts

// 1. Search reliable sources only
const reliableSources = [
  'wikipedia.org',
  'whc.unesco.org', // UNESCO World Heritage
  'britannica.com',
  'sacred-destinations.com'
];

// 2. Get information with citations
const result = await perplexity.search({
  query: `${placeName} ${placeType} history architecture`,
  search_domain_filter: reliableSources
});

// 3. Return with sources for verification
return {
  description: result.content,
  sources: result.citations,
  requiresVerification: true
};
```

---

## Reliable Sources to Use

| Source | Type | Reliability |
|--------|------|-------------|
| **Wikipedia** | Encyclopedia | High (cited, community-verified) |
| **UNESCO World Heritage** | Official | Very High (expert-verified) |
| **Britannica** | Encyclopedia | Very High (expert-written) |
| **Official tourism boards** | Government | High (official sources) |
| **Sacred-destinations.com** | Specialized | High (focused on sacred sites) |

---

## Data Flow with Verification

```text
┌──────────────────────────────────────────────────────────────────┐
│                         DATA ENRICHMENT FLOW                      │
└──────────────────────────────────────────────────────────────────┘

     ┌─────────────┐
     │ Admin wants │
     │ to add new  │
     │ sacred place│
     └──────┬──────┘
            │
            ▼
     ┌─────────────┐
     │ Search web  │
     │ (Perplexity │
     │ or Firecrawl│
     └──────┬──────┘
            │
            ▼
     ┌─────────────┐
     │ Display     │
     │ sources &   │
     │ citations   │
     └──────┬──────┘
            │
            ▼
     ┌─────────────┐
     │ Admin       │
     │ reviews &   │◄─── HUMAN VERIFICATION
     │ edits       │
     └──────┬──────┘
            │
            ▼
     ┌─────────────┐
     │ Save with   │
     │ source_urls │
     │ & verified  │
     └──────┬──────┘
            │
            ▼
     ┌─────────────┐
     │ Available   │
     │ in app &    │
     │ chatbot     │
     └─────────────┘
```

---

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `supabase/functions/enrich-place-data/index.ts` | Edge function to search reliable sources |
| `src/pages/AdminEnrichData.tsx` | Admin interface for data curation |
| `src/components/admin/PlaceEnrichmentForm.tsx` | Form to search, review, and save |
| Database migration | Add source_urls, verified_by columns |

---

## Summary

| Approach | Speed | Accuracy | Effort |
|----------|-------|----------|--------|
| **Manual curation** | Slow | 100% | High |
| **Admin-verified web search** | Medium | 100% | Medium |
| **Automated with citations** | Fast | 95%+ | Low |

**Recommendation:** Use **Admin-verified web search** - it combines speed (automated search) with accuracy (human verification before saving). The chatbot will only use data that has been reviewed and approved, ensuring zero hallucinations.

---

## Next Steps

1. Connect Perplexity or Firecrawl connector for web search
2. Add source tracking columns to places table
3. Create admin enrichment interface
4. Integrate verified data into chatbot context
