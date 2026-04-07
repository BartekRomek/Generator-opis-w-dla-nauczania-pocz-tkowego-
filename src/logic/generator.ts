import { EvaluationState, Level } from "../types";

const getLevelDescriptor = (value: number): string => {
  if (value <= 2) return "duże trudności";
  if (value <= 4) return "wymaga wsparcia";
  if (value <= 6) return "poziom podstawowy";
  if (value <= 8) return "dobry poziom";
  return "bardzo dobry poziom";
};

const getGenderedNoun = (gender: 'male' | 'female', male: string, female: string) => 
  gender === 'male' ? male : female;

export const generateDescription = (state: EvaluationState): string => {
  const { student, sections } = state;
  const isM = student.gender === 'male';
  const name = student.name || getGenderedNoun(student.gender, "Uczeń", "Uczennica");
  
  const allItems = sections.flatMap(s => s.items).filter(i => i.enabled);
  if (allItems.length === 0) return "Proszę uzupełnić oceny, aby wygenerować opis.";

  const getAvg = (ids: string[]) => {
    const items = allItems.filter(i => ids.includes(i.id));
    if (items.length === 0) return null;
    return items.reduce((acc, i) => acc + i.value, 0) / items.length;
  };

  const polishAvg = getAvg(['reading-tech', 'reading-comp', 'writing-est', 'writing-corr', 'oral']);
  const mathAvg = getAvg(['math-count', 'math-tasks', 'math-logic']);
  const scienceAvg = getAvg(['science-knowledge', 'science-activity']);
  const artAvg = getAvg(['art-creativity', 'art-engagement']);
  const peAvg = getAvg(['pe-fitness', 'pe-activity']);
  
  const eduAvgs = [polishAvg, mathAvg, scienceAvg, artAvg, peAvg].filter(a => a !== null) as number[];
  const overallEduAvg = eduAvgs.length > 0 ? eduAvgs.reduce((a, b) => a + b, 0) / eduAvgs.length : 5;

  const sentences: string[] = [];

  // 1. Wprowadzenie (1-2 zdania)
  if (overallEduAvg >= 8.5) {
    sentences.push(`${name} jest ${getGenderedNoun(student.gender, "wyjątkowo zdolnym uczniem", "wyjątkowo zdolną uczennicą")}, który ${getGenderedNoun(student.gender, "z ogromną pasją", "z ogromną pasją")} podchodzi do codziennych obowiązków szkolnych.`);
    sentences.push(`Prezentowana przez ${getGenderedNoun(student.gender, "niego", "nią")} postawa oraz osiągane wyniki stanowią wzór do naśladowania dla całej grupy rówieśniczej.`);
  } else if (overallEduAvg >= 6.5) {
    sentences.push(`${name} to ${getGenderedNoun(student.gender, "uważny uczeń", "uważna uczennica")}, który ${getGenderedNoun(student.gender, "rzetelnie", "rzetelnie")} wywiązuje się z powierzonych zadań i wykazuje dużą chęć do zdobywania nowej wiedzy.`);
    sentences.push(`W minionym okresie ${getGenderedNoun(student.gender, "wykazał", "wykazała")} się systematycznością, co pozwoliło na ugruntowanie wiadomości w większości obszarów edukacyjnych.`);
  } else if (overallEduAvg >= 4.5) {
    sentences.push(`${name} poprawnie funkcjonuje w roli ${getGenderedNoun(student.gender, "ucznia", "uczennicy")}, starając się sprostać wymaganiom stawianym na tym etapie edukacji.`);
    sentences.push(`Wykazuje się stabilnym poziomem opanowania materiału, choć niektóre sytuacje wymagają od ${getGenderedNoun(student.gender, "niego", "niej")} większego skupienia.`);
  } else {
    sentences.push(`${name} napotyka na liczne wyzwania w procesie dydaktycznym, co sprawia, że codzienna nauka wymaga od ${getGenderedNoun(student.gender, "niego", "niej")} dużego wysiłku.`);
    sentences.push(`Wymaga stałego wsparcia i ukierunkowania, aby móc w pełni realizować program nauczania adekwatny do swoich możliwości.`);
  }

  // 2. Funkcjonowanie edukacyjne (3-5 zdań)
  const eduLevel = getLevelDescriptor(overallEduAvg);
  sentences.push(`Większość zadań edukacyjnych ${getGenderedNoun(student.gender, "uczeń", "uczennica")} realizuje na poziomie, który można określić jako ${eduLevel}.`);
  
  if (overallEduAvg >= 7) {
    sentences.push(`Z łatwością przyswaja nowe treści i potrafi wykorzystać zdobytą wiedzę w sytuacjach praktycznych, co świadczy o ${getGenderedNoun(student.gender, "jego", "jej")} dużej dojrzałości poznawczej.`);
    sentences.push(`Wykazuje się dużą sprawnością w operowaniu poznanymi pojęciami oraz umiejętnością logicznego łączenia faktów.`);
  } else if (overallEduAvg >= 4) {
    sentences.push(`Potrafi samodzielnie wykonać typowe ćwiczenia, jednak przy bardziej złożonych problemach oczekuje dodatkowych wyjaśnień lub pomocy ze strony nauczyciela.`);
    sentences.push(`W pracy z tekstem oraz przy zadaniach wymagających logicznego myślenia stara się postępować zgodnie z instrukcją.`);
  } else {
    sentences.push(`Często potrzebuje dodatkowego czasu na zrozumienie poleceń oraz wielokrotnego powtarzania instrukcji do zadań.`);
    sentences.push(`Opanowanie podstawowych umiejętności szkolnych przychodzi ${getGenderedNoun(student.gender, "mu", "jej")} z trudem, co wiąże się z koniecznością intensywnej pracy wyrównawczej.`);
  }

  // Specyficzne uogólnienie o mocnych stronach
  const highlights = [];
  if (mathAvg && mathAvg > overallEduAvg + 1) highlights.push("obszary wymagające logicznego i analitycznego podejścia");
  if (polishAvg && polishAvg > overallEduAvg + 1) highlights.push("zadania związane z wypowiedziami oraz interpretacją treści");
  if (artAvg && artAvg > overallEduAvg + 1) highlights.push("działania o charakterze twórczym i artystycznym");
  if (peAvg && peAvg > overallEduAvg + 1) highlights.push("aktywność ruchową i sprawność fizyczną");

  if (highlights.length > 0) {
    sentences.push(`Szczególną łatwość wykazuje w ${highlights[0]}, co pozwala ${getGenderedNoun(student.gender, "mu", "jej")} na osiąganie wyników powyżej przeciętnej.`);
  } else {
    sentences.push(`Rozwój w poszczególnych obszarach wiedzy przebiega w sposób harmonijny i wyrównany.`);
  }

  // 3. Sposób pracy (2-3 zdania)
  const independence = allItems.find(i => i.id === 'comp-independence')?.value || 5;
  const concentration = allItems.find(i => i.id === 'comp-concentration')?.value || 5;
  const engagement = allItems.find(i => i.id === 'comp-engagement')?.value || 5;

  if (independence >= 8 && concentration >= 8) {
    sentences.push(`Podczas lekcji pracuje w sposób w pełni samodzielny, wykazując się dużą starannością oraz umiejętnością długotrwałego skupienia uwagi.`);
    sentences.push(`Zawsze dba o estetykę wykonywanych prac i potrafi zorganizować własne stanowisko pracy bez przypominania.`);
  } else if (independence <= 4 || concentration <= 4) {
    sentences.push(`Tempo pracy ${getGenderedNoun(student.gender, "ucznia", "uczennicy")} jest często uzależnione od stopnia trudności zadania, a ${getGenderedNoun(student.gender, "jego", "jej")} uwaga bywa rozproszona.`);
    sentences.push(`Wymaga częstego motywowania do dokończenia rozpoczętych działań oraz kontroli poprawności wykonywanych etapów pracy.`);
  } else {
    sentences.push(`Pracuje w tempie umiarkowanym, starając się rzetelnie wypełniać powierzone obowiązki, choć zdarza ${getGenderedNoun(student.gender, "mu", "jej")} się popełniać drobne błędy wynikające z pośpiechu.`);
    sentences.push(`Wykazuje się zadowalającą samodzielnością, chętnie podejmując próby rozwiązywania problemów przed poproszeniem o pomoc.`);
  }

  // 4. Zachowanie i relacje społeczne (2-3 zdania)
  const behavior = allItems.find(i => i.id === 'comp-behavior')?.value || 5;
  const group = allItems.find(i => i.id === 'comp-group')?.value || 5;

  if (behavior >= 8 && group >= 8) {
    sentences.push(`W relacjach z rówieśnikami jest ${getGenderedNoun(student.gender, "niezwykle koleżeński i uprzejmy", "niezwykle koleżeńska i uprzejma")}, zawsze dbając o przestrzeganie ustalonych zasad współżycia w grupie.`);
    sentences.push(`Chętnie niesie pomoc innym i potrafi konstruktywnie współpracować w zespole, przyjmując na siebie odpowiedzialność za wspólny wynik.`);
  } else if (behavior <= 4) {
    sentences.push(`Postawa społeczna ${getGenderedNoun(student.gender, "ucznia", "uczennicy")} wymaga dalszej pracy, szczególnie w zakresie opanowania emocji i przestrzegania regulaminu klasy.`);
    sentences.push(`Zdarza ${getGenderedNoun(student.gender, "mu", "jej")} się wchodzić w konflikty, co utrudnia efektywną współpracę z innymi dziećmi.`);
  } else {
    sentences.push(`${name} poprawnie funkcjonuje w zespole klasowym, wykazując się odpowiednią kulturą osobistą wobec dorosłych i kolegów.`);
    sentences.push(`Potrafi zgodnie bawić się i pracować w grupie, starając się dostosować do potrzeb innych uczestników zajęć.`);
  }

  // 5. Postępy i podsumowanie (2-3 zdania)
  const progress = allItems.find(i => i.id === 'comp-progress')?.value || 5;

  // Logika zaangażowania vs wyniki
  if (overallEduAvg >= 8 && engagement <= 4) {
    sentences.push(`Należy jednak zauważyć, że przy większym zaangażowaniu i systematyczności, ${name} mógłby osiągać jeszcze bardziej spektakularne sukcesy.`);
  } else if (overallEduAvg <= 5 && engagement >= 8) {
    sentences.push(`Na szczególne uznanie zasługuje ogromny wysiłek i serce, jakie ${getGenderedNoun(student.gender, "uczeń", "uczennica")} wkłada w każdą czynność, co jest kluczem do ${getGenderedNoun(student.gender, "jego", "jej")} dalszego rozwoju.`);
  }

  if (progress >= 8) {
    sentences.push(`Wyraźne postępy, jakie ${getGenderedNoun(student.gender, "poczynił", "poczyniła")} w ostatnim czasie, są powodem do dużej satysfakcji i dają nadzieję na dalsze sukcesy.`);
    sentences.push(`Zaleca się kontynuowanie dotychczasowej drogi rozwoju i rozwijanie naturalnych talentów.`);
  } else if (overallEduAvg <= 4) {
    sentences.push(`Dalsza, cierpliwa praca nad ugruntowaniem podstawowych wiadomości oraz systematyczne ćwiczenia w domu są niezbędne do pokonania istniejących barier.`);
    sentences.push(`Wsparcie ze strony najbliższego otoczenia będzie kluczowe dla budowania wiary we własne możliwości.`);
  } else {
    sentences.push(`Dalsza, regularna praca pozwoli na harmonijne rozwijanie posiadanych umiejętności i przygotowanie do kolejnych etapów edukacji.`);
    sentences.push(`Warto zachęcać ${getGenderedNoun(student.gender, "ucznia", "uczennicę")} do podejmowania nowych wyzwań, które pozwolą ${getGenderedNoun(student.gender, "mu", "jej")} w pełni rozwinąć skrzydła.`);
  }

  // Final check for length and joining
  return sentences.join(" ");
};
