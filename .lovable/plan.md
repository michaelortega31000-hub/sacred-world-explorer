
User wants halal & kosher restaurants removed since the app targets Christians. Need to find where restaurants are filtered/displayed and where these types are defined.

Key files to check: RestaurantsTab, AddRestaurantDialog (already seen — has halal/kosher in restaurantTypes), restaurants table data.

Plan: filter out halal/kosher in the UI (display + filter chips) and remove them from the add-restaurant form options. Don't delete DB rows (non-destructive).
