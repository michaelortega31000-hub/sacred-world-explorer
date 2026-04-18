import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { COUNTRIES, getCountryByCode } from '@/data/countries';

interface CountrySelectProps {
  value: string | null;
  onChange: (code: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
}

export const CountrySelect = ({
  value,
  onChange,
  placeholder = 'Sélectionnez votre pays',
  className,
  triggerClassName,
}: CountrySelectProps) => {
  const [open, setOpen] = useState(false);
  const selected = getCountryByCode(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', triggerClassName)}
        >
          {selected ? (
            <span className="flex items-center gap-2 truncate">
              <span className="text-xl leading-none">{selected.flag}</span>
              <span className="truncate">{selected.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[--radix-popover-trigger-width] p-0 z-[60]', className)}>
        <Command>
          <CommandInput placeholder="Rechercher un pays…" />
          <CommandList>
            <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
            <CommandGroup>
              {COUNTRIES.map((c) => (
                <CommandItem
                  key={c.code}
                  value={`${c.name} ${c.code}`}
                  onSelect={() => {
                    onChange(c.code);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-xl leading-none">{c.flag}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <Check
                    className={cn(
                      'h-4 w-4',
                      value === c.code ? 'opacity-100 text-primary' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySelect;
