import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Calculator, 
  Leaf, 
  Palette, 
  Dumbbell, 
  Brain, 
  User, 
  Copy, 
  FileDown, 
  Check, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { EvaluationState, Level, EvaluationSection as ISection } from './types';
import { generateDescription } from './logic/generator';
import { cn } from './lib/utils';

const INITIAL_STATE: EvaluationState = {
  student: {
    name: '',
    className: '1A',
    schoolYear: '2025/2026',
    gender: 'male'
  },
  sections: [
    {
      id: 'polish',
      title: 'Edukacja polonistyczna',
      items: [
        { id: 'reading-tech', label: 'Czytanie (technika)', value: 5, enabled: true },
        { id: 'reading-comp', label: 'Czytanie (rozumienie)', value: 5, enabled: true },
        { id: 'writing-est', label: 'Pisanie (estetyka)', value: 5, enabled: true },
        { id: 'writing-corr', label: 'Pisanie (poprawność)', value: 5, enabled: true },
        { id: 'oral', label: 'Wypowiedzi ustne', value: 5, enabled: true },
      ]
    },
    {
      id: 'math',
      title: 'Edukacja matematyczna',
      items: [
        { id: 'math-count', label: 'Liczenie', value: 5, enabled: true },
        { id: 'math-tasks', label: 'Zadania tekstowe', value: 5, enabled: true },
        { id: 'math-logic', label: 'Logiczne myślenie', value: 5, enabled: true },
      ]
    },
    {
      id: 'science',
      title: 'Edukacja społeczno-przyrodnicza',
      items: [
        { id: 'science-knowledge', label: 'Wiedza', value: 5, enabled: true },
        { id: 'science-activity', label: 'Aktywność', value: 5, enabled: true },
      ]
    },
    {
      id: 'art',
      title: 'Edukacja artystyczna',
      items: [
        { id: 'art-creativity', label: 'Kreatywność', value: 5, enabled: true },
        { id: 'art-engagement', label: 'Zaangażowanie', value: 5, enabled: true },
      ]
    },
    {
      id: 'pe',
      title: 'Wychowanie fizyczne',
      items: [
        { id: 'pe-fitness', label: 'Sprawność', value: 5, enabled: true },
        { id: 'pe-activity', label: 'Aktywność', value: 5, enabled: true },
      ]
    },
    {
      id: 'general',
      title: 'Kompetencje ogólne',
      items: [
        { id: 'comp-engagement', label: 'Zaangażowanie', value: 5, enabled: true },
        { id: 'comp-independence', label: 'Samodzielność', value: 5, enabled: true },
        { id: 'comp-group', label: 'Praca w grupie', value: 5, enabled: true },
        { id: 'comp-behavior', label: 'Zachowanie', value: 5, enabled: true },
        { id: 'comp-concentration', label: 'Koncentracja', value: 5, enabled: true },
        { id: 'comp-progress', label: 'Postępy', value: 5, enabled: true },
      ]
    }
  ]
};

export default function App() {
  const [state, setState] = useState<EvaluationState>(INITIAL_STATE);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('polish');

  const description = useMemo(() => generateDescription(state), [state]);

  const updateStudent = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      student: { ...prev.student, [field]: value }
    }));
  };

  const updateItem = (sectionId: string, itemId: string, updates: Partial<{ value: Level; enabled: boolean }>) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId 
          ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, ...updates } : i) }
          : s
      )
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(description, 180);
    
    doc.setFont("helvetica", "bold");
    doc.text(`OCENA OPISOWA UCZNIA`, 105, 20, { align: 'center' });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Uczeń: ${state.student.name || '---'}`, 20, 40);
    doc.text(`Klasa: ${state.student.className}`, 20, 50);
    doc.text(`Rok szkolny: ${state.student.schoolYear}`, 20, 60);
    
    doc.line(20, 65, 190, 65);
    
    doc.text(splitText, 20, 80);
    
    doc.save(`Ocena_${state.student.name.replace(/\s+/g, '_') || 'ucznia'}.pdf`);
  };

  const getSliderColor = (val: number) => {
    if (val <= 2) return 'bg-red-500';
    if (val <= 4) return 'bg-orange-400';
    if (val <= 6) return 'bg-yellow-400';
    if (val <= 8) return 'bg-lime-500';
    return 'bg-green-500';
  };

  const sectionIcons: Record<string, React.ReactNode> = {
    polish: <BookOpen className="w-5 h-5" />,
    math: <Calculator className="w-5 h-5" />,
    science: <Leaf className="w-5 h-5" />,
    art: <Palette className="w-5 h-5" />,
    pe: <Dumbbell className="w-5 h-5" />,
    general: <Brain className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Generator Ocen Opisowych</h1>
            <p className="text-slate-500">Profesjonalne opisy dla klas 1-3</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Student Info Card */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6 text-indigo-600 font-semibold">
                <User className="w-5 h-5" />
                <h2>Dane ucznia</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Imię i Nazwisko</label>
                  <input 
                    type="text" 
                    value={state.student.name}
                    onChange={(e) => updateStudent('name', e.target.value)}
                    placeholder="np. Jan Kowalski"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Klasa</label>
                    <input 
                      type="text" 
                      value={state.student.className}
                      onChange={(e) => updateStudent('className', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Płeć</label>
                    <select 
                      value={state.student.gender}
                      onChange={(e) => updateStudent('gender', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                    >
                      <option value="male">Uczeń</option>
                      <option value="female">Uczennica</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Evaluation Sections Navigation */}
            <div className="flex flex-wrap gap-2 mb-4">
              {state.sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    activeSection === section.id 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-100"
                  )}
                >
                  {sectionIcons[section.id]}
                  {section.title}
                </button>
              ))}
            </div>

            {/* Active Section Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
              >
                <div className="space-y-8">
                  {state.sections.find(s => s.id === activeSection)?.items.map(item => (
                    <div key={item.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateItem(activeSection, item.id, { enabled: !item.enabled })}
                            className={cn(
                              "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                              item.enabled ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300"
                            )}
                          >
                            {item.enabled && <Check className="w-3 h-3" />}
                          </button>
                          <span className={cn("font-medium", !item.enabled && "text-slate-300 line-through")}>
                            {item.label}
                          </span>
                        </div>
                        {item.enabled && (
                          <span className={cn(
                            "px-2 py-1 rounded-md text-xs font-bold text-white",
                            getSliderColor(item.value)
                          )}>
                            {item.value}/10
                          </span>
                        )}
                      </div>
                      
                      {item.enabled && (
                        <div className="relative pt-1">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={item.value}
                            onChange={(e) => updateItem(activeSection, item.id, { value: parseInt(e.target.value) as Level })}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                            <span>Trudności</span>
                            <span>Podstawowy</span>
                            <span>Wzorowy</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 min-h-[500px] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Podgląd opisu</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 relative"
                      title="Kopiuj do schowka"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button 
                      onClick={exportToPDF}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                      title="Eksportuj do PDF"
                    >
                      <FileDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap italic">
                    {description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                      ))}
                    </div>
                    <p>Opis generowany na żywo na podstawie Twoich ustawień.</p>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Wskazówka
                </h4>
                <p className="text-sm text-indigo-700 leading-snug">
                  Aplikacja automatycznie dopasowuje formy gramatyczne do płci ucznia oraz łączy zdania w spójną całość, unikając powtórzeń.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
