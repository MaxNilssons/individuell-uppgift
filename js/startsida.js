addMdToPage(`
# Psykisk ohälsa bland studenter i Indien

Det här projektet handlar om att undersöka hur olika faktorer hänger ihop med psykisk ohälsa bland studenter i Indien, baserat på enkätsvar från tusentals deltagare.

Jag har analyserat samband mellan **depression** och faktorer som:

- Akademiska prestationer (CGPA)
- Sömnvanor
- Upplevd akademisk press
- Kost och livsstil
- Mental ohälsa i familjen
- Kön
- Studietid per dag

Genom att kombinera databasfrågor, statistiska analyser och interaktiva visualiseringar har jag försökt identifiera mönster och förstå vilka faktorer som påverkar psykiskt mående mest.

---

## Metod

Datan kommer från en strukturerad enkätundersökning bland studenter i Indien. Jag har importerat datan till en SQLite-databas och använt SQL-frågor för att hämta relevanta värden.

Med hjälp av mallen har jag: 
- Grupperat data och beräknat medelvärden
- Genomfört statistiska tester (t.ex. t-test och korrelation)
- Visualiserat resultaten i interaktiva diagram via Google Charts
- Tillämpat filter (ex. kön) med dropdown för att kunna jämföra grupper

Resultaten har jag tolkat och diskuterat i varje undersökning, samt sammanfattat allt i en avslutande analys.

---

Välj en sida i menyn högst upp för att se information om en specifik faktor.
`);
