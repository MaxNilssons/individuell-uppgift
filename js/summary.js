addMdToPage(`
## Sammanfattande analys: Psykisk ohälsa bland studenter i Indien

I detta projekt har jag analyserat hur olika faktorer samverkar med psykisk ohälsa bland studenter i Indien. Fokus har legat på att undersöka möjliga samband mellan depression och faktorer såsom akademisk prestation, sömnvanor, kost och kön. Syftet har varit att identifiera mönster och reflektera över deras möjliga betydelse.

### Akademiska prestationer och depression

Inledningsvis undersöktes sambandet mellan betyg (CGPA) och förekomsten av depression. Analysen visade att studenter med högre CGPA tenderade att uppvisa en högre andel depressionssymtom. Ett t-test bekräftade att denna skillnad var statistiskt signifikant, vilket tyder på ett mätbart samband mellan akademiska prestationer och psykisk ohälsa.

### Sömn och psykisk hälsa

Analysen av sömnvanor visade att studenter som sover mindre än sju timmar per natt i genomsnitt uppvisade en högre andel depression. Det är dock oklart om sömnbrist är en orsak till depression eller en konsekvens av den. Resultatet understryker vikten av att sova tillräckligt för att främja psykiskt välmående.

### Korrelation och tolkning

Ett antal samband har identifierats, bland annat mellan betyg och depression samt mellan sömn och depression. Det är viktigt att notera att ett statistiskt samband inte innebär ett orsakssamband. Externa faktorer såsom stress, sociala förväntningar eller ekonomiska svårigheter kan påverka både akademiska resultat och psykisk hälsa.

### Statistisk signifikans

För att fördjupa analysen användes t-test för att avgöra om skillnaden i depression mellan två CGPA-grupper (under 7.0 respektive 7.0 och högre) var signifikant. Testet visade ett p-värde under 0,05, vilket innebär att nollhypotesen kunde förkastas. Det stärker antagandet att skillnaden i depression mellan grupperna är reell, men säger fortfarande inget om orsakssamband.

### Datakvalitet och normalfördelning

En granskning av CGPA-data visade att den inte är perfekt normalfördelad. Detta påverkar förutsättningarna för vissa statistiska tester, men i detta fall kunde t-testet ändå tillämpas med viss försiktighet. Medvetenhet om datans begränsningar är avgörande för att dra rättvisa slutsatser.

## Slutsats

Projektet har gett en ökad förståelse för komplexiteten i psykisk ohälsa bland studenter. Flera mätbara samband har identifierats, särskilt kopplingen mellan akademisk press och depressionsnivåer. Det är tydligt att psykisk ohälsa inte kan förklaras av en enskild faktor, utan är resultatet av flera samverkande orsaker. Arbetet har också bidragit till ökad färdighet i att bearbeta och tolka statistisk data.

## Reflektion: Vad jag lärde mig

Under arbetets gång lärde jag mig att analysera data på ett mer strukturerat sätt med hjälp av SQL, statistik och JavaScript. Jag fick också insikt i hur faktorer som sömn, betyg, kön och psykisk ohälsa i familjen kan relatera till depression bland studenter.

Jag fick träna på att:
- Tillämpa statistiska metoder som t-test och korrelation
- Visualisera data med hjälp av interaktiva diagram
- Tolka resultat kritiskt och förstå begrepp som kausalitet och bias
- Filtrera data utifrån grupper, till exempel kön

### Utmaningar

En utmaning var att tolka data där svaren var kvalitativa (exempelvis "7–8 timmar sömn") och omvandla dem till kvantitativa värden som gick att räkna på. Det var också viktigt att tänka på att viss data, som CGPA, inte alltid är perfekt normalfördelad, vilket påverkar vilka tester som är lämpliga att använda.

Att bygga upp ett interaktivt och tydligt gränssnitt för varje analys med dropdown-menyer, tabeller och diagram krävde också en hel del testning och justeringar.

### Sammanfattning

Projektet gav mig en bättre förståelse för hur man kombinerar programmering, databashantering och statistisk analys för att undersöka samhällsfrågor. Det var både utmanande och lärorikt – och framför allt relevant för att förstå psykisk ohälsa i ett större sammanhang.

## Källor och bakgrund

- India Today (2024). *Mental health crisis: Why is mental health education important for students?*  
  https://www.indiatoday.in/education-today/featurephilia/story/mental-health-crisis-why-is-mental-health-education-important-for-students-2641662-2024-11-28

- Natarajan, R. (2015). *Higher education in India: The need for change*. Procedia - Social and Behavioral Sciences, Elsevier.  
  https://www.sciencedirect.com/science/article/abs/pii/S1876201815301179

Dessa källor har bidragit till att ge kontext åt analysen och ökad förståelse för ämnet psykisk ohälsa.

Max Nilsson DM 24
`);
