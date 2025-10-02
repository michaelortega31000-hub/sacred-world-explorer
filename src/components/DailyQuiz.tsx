import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, Clock, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'religion' | 'monument' | 'edifice' | 'anecdote';
  explanation?: string;
};

const allQuestions: Question[] = [
  {
    id: '1',
    question: 'Quel est le lieu de pèlerinage le plus sacré de l\'Islam ?',
    options: ['Jérusalem', 'La Mecque', 'Médine', 'Le Caire'],
    correctAnswer: 1,
    category: 'religion',
    explanation: 'La Mecque est le lieu de pèlerinage le plus important pour les musulmans.'
  },
  {
    id: '2',
    question: 'Dans quelle ville se trouve la Basilique Saint-Pierre ?',
    options: ['Rome', 'Florence', 'Milan', 'Venise'],
    correctAnswer: 0,
    category: 'monument',
    explanation: 'La Basilique Saint-Pierre se trouve au Vatican à Rome.'
  },
  {
    id: '3',
    question: 'Quel style architectural caractérise Notre-Dame de Paris ?',
    options: ['Roman', 'Gothique', 'Baroque', 'Renaissance'],
    correctAnswer: 1,
    category: 'edifice',
    explanation: 'Notre-Dame de Paris est un chef-d\'œuvre de l\'architecture gothique.'
  },
  {
    id: '4',
    question: 'Combien de temps a duré la construction de la Sagrada Familia ?',
    options: ['50 ans', '100 ans', 'Plus de 140 ans', '200 ans'],
    correctAnswer: 2,
    category: 'anecdote',
    explanation: 'La construction a débuté en 1882 et se poursuit encore aujourd\'hui.'
  },
  {
    id: '5',
    question: 'Quel est le plus ancien temple hindou encore en activité ?',
    options: ['Angkor Wat', 'Temple de Madurai', 'Temple de Pashupatinath', 'Prambanan'],
    correctAnswer: 2,
    category: 'religion',
    explanation: 'Le temple de Pashupatinath au Népal date du 5ème siècle.'
  },
  {
    id: '6',
    question: 'Quelle cathédrale possède les plus hautes flèches de France ?',
    options: ['Notre-Dame de Paris', 'Cathédrale de Chartres', 'Cathédrale de Rouen', 'Cathédrale de Strasbourg'],
    correctAnswer: 2,
    category: 'edifice',
    explanation: 'La flèche de la cathédrale de Rouen culmine à 151 mètres.'
  },
  {
    id: '7',
    question: 'Dans le bouddhisme, que représente le stupa ?',
    options: ['Un temple', 'Un monument reliquaire', 'Une statue', 'Un monastère'],
    correctAnswer: 1,
    category: 'religion',
    explanation: 'Le stupa est un monument reliquaire bouddhiste.'
  },
  {
    id: '8',
    question: 'Quel monument célèbre a été construit en mémoire d\'une épouse ?',
    options: ['Tour Eiffel', 'Taj Mahal', 'Big Ben', 'Statue de la Liberté'],
    correctAnswer: 1,
    category: 'monument',
    explanation: 'Le Taj Mahal a été construit par l\'empereur moghol en mémoire de son épouse.'
  },
  {
    id: '9',
    question: 'Combien de religions principales existe-t-il dans le monde ?',
    options: ['3', '5', '7', '12'],
    correctAnswer: 1,
    category: 'religion',
    explanation: 'Les 5 religions principales sont le christianisme, l\'islam, l\'hindouisme, le bouddhisme et le judaïsme.'
  },
  {
    id: '10',
    question: 'Quelle mosquée est connue pour ses mosaïques bleues ?',
    options: ['Mosquée Hassan II', 'Mosquée Bleue', 'Grande Mosquée de Cordoue', 'Mosquée d\'Al-Azhar'],
    correctAnswer: 1,
    category: 'monument',
    explanation: 'La Mosquée Bleue d\'Istanbul est célèbre pour ses carreaux d\'Iznik bleus.'
  },
  {
    id: '11',
    question: 'Quel est le plus grand temple bouddhiste du monde ?',
    options: ['Angkor Wat', 'Borobudur', 'Bagan', 'Todai-ji'],
    correctAnswer: 1,
    category: 'edifice',
    explanation: 'Borobudur en Indonésie est le plus grand monument bouddhiste au monde.'
  },
  {
    id: '12',
    question: 'Dans quelle ville se trouve le Mur des Lamentations ?',
    options: ['Tel Aviv', 'Jérusalem', 'Bethléem', 'Nazareth'],
    correctAnswer: 1,
    category: 'religion',
    explanation: 'Le Mur des Lamentations se trouve dans la vieille ville de Jérusalem.'
  },
  {
    id: '13',
    question: 'Combien de portes possède la cathédrale Notre-Dame de Paris ?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    category: 'anecdote',
    explanation: 'Notre-Dame possède trois portails principaux sur sa façade.'
  },
  {
    id: '14',
    question: 'Quel temple est dédié à la déesse Athéna ?',
    options: ['Le Panthéon', 'Le Parthénon', 'Le Colisée', 'Le Temple d\'Artémis'],
    correctAnswer: 1,
    category: 'monument',
    explanation: 'Le Parthénon à Athènes était dédié à la déesse Athéna.'
  },
  {
    id: '15',
    question: 'Quelle religion pratique le pèlerinage du Kumbh Mela ?',
    options: ['Bouddhisme', 'Hindouisme', 'Jaïnisme', 'Sikhisme'],
    correctAnswer: 1,
    category: 'religion',
    explanation: 'Le Kumbh Mela est le plus grand pèlerinage hindou au monde.'
  }
];

const DailyQuiz = () => {
  const { userProgress, addPoints } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [dailyQuestions, setDailyQuestions] = useState<Question[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [lastQuizDate, setLastQuizDate] = useState<string | null>(null);

  // Générer les 5 questions du jour
  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('lastQuizDate');
    const storedCompleted = localStorage.getItem('quizCompleted') === 'true';

    if (storedDate === today && storedCompleted) {
      setQuizCompleted(true);
      setLastQuizDate(storedDate);
    } else {
      // Nouvelle journée ou quiz non complété
      if (storedDate !== today) {
        localStorage.setItem('quizCompleted', 'false');
        setQuizCompleted(false);
      }
      setLastQuizDate(today);
      localStorage.setItem('lastQuizDate', today);
    }

    // Sélectionner 5 questions aléatoires
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setDailyQuestions(shuffled.slice(0, 5));
  }, []);

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === dailyQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < dailyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz terminé
      const finalScore = score + (selectedAnswer === dailyQuestions[currentQuestion].correctAnswer ? 1 : 0);
      if (finalScore === 5) {
        addPoints(10);
        toast.success('🎉 Quiz parfait ! +10 points');
      } else {
        toast.info(`Quiz terminé ! ${finalScore}/5 bonnes réponses`);
      }
      setQuizCompleted(true);
      localStorage.setItem('quizCompleted', 'true');
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (dailyQuestions.length === 0) {
    return null;
  }

  const categoryIcons = {
    religion: '🕌',
    monument: '🏛️',
    edifice: '⛪',
    anecdote: '💡'
  };

  const categoryLabels = {
    religion: 'Religion',
    monument: 'Monument',
    edifice: 'Édifice',
    anecdote: 'Anecdote'
  };

  if (quizCompleted) {
    return (
      <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              Quiz du jour
            </CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Trophy className="w-4 h-4" />
              Complété
            </Badge>
          </div>
          <CardDescription>
            Vous avez complété le quiz d'aujourd'hui ! Revenez demain pour un nouveau défi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-muted-foreground">
              Prochain quiz disponible dans {24 - new Date().getHours()} heures
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = dailyQuestions[currentQuestion];
  const categoryIcon = categoryIcons[question.category];
  const categoryLabel = categoryLabels[question.category];

  return (
    <Card className="border-2 border-secondary bg-gradient-to-br from-secondary/5 to-secondary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Brain className="w-6 h-6 text-secondary" />
            Quiz du jour
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              Question {currentQuestion + 1}/5
            </Badge>
            <Badge variant="secondary">+10 pts</Badge>
          </div>
        </div>
        <CardDescription>
          5 questions quotidiennes • Répondez correctement à toutes pour gagner 10 points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Badge variant="outline" className="mb-4">
            {categoryIcon} {categoryLabel}
          </Badge>
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>

          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            disabled={showResult}
            className="space-y-3"
          >
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                    showCorrect
                      ? 'bg-green-50 border-green-500'
                      : showWrong
                      ? 'bg-red-50 border-red-500'
                      : isSelected
                      ? 'bg-secondary/10 border-secondary'
                      : 'border-border hover:border-secondary/50'
                  }`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {option}
                  </Label>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {showWrong && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {showResult && question.explanation && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>💡 Le saviez-vous ?</strong> {question.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Score actuel : {score}/{currentQuestion + (showResult ? 1 : 0)}
          </div>
          {!showResult ? (
            <Button
              onClick={handleAnswer}
              disabled={selectedAnswer === null}
              className="gap-2"
            >
              Valider
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-2">
              {currentQuestion < dailyQuestions.length - 1 ? 'Question suivante' : 'Terminer'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyQuiz;
