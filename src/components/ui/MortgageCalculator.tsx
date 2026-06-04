import { useState, useMemo } from 'react';
import { Calculator, DollarSign, Percent, CalendarDays, TrendingUp } from 'lucide-react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(value);
}

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState(150000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [termMonths, setTermMonths] = useState(12);

  const results = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const n = termMonths;

    if (monthlyRate === 0) {
      const monthlyPayment = loanAmount / n;
      return {
        monthlyPayment,
        totalPayment: loanAmount,
        totalInterest: 0,
      };
    }

    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1);

    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - loanAmount;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
    };
  }, [loanAmount, interestRate, termMonths]);

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-accent-50 text-accent-600 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
            <Calculator className="h-3.5 w-3.5 md:h-4 md:w-4" />
            Outil de calcul
          </div>
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary-700 mb-2 md:mb-4">
            Calculateur hypothécaire
          </h2>
          <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">
            Estimez vos paiements mensuels pour un prêt avec garantie immobilière
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start">
          {/* Inputs */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-5 md:p-8">
            <h3 className="font-serif text-lg md:text-xl font-bold text-primary-700 mb-4 md:mb-6">
              Paramètres du prêt
            </h3>

            {/* Loan amount */}
            <div className="mb-6">
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-accent-500" />
                  Montant du prêt
                </span>
                <span className="text-primary-700 font-bold">{formatCurrency(loanAmount)}</span>
              </label>
              <input
                type="range"
                min={10000}
                max={1000000}
                step={5000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-primary-100 rounded-full appearance-none cursor-pointer accent-accent-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>10 000 $</span>
                <span>1 000 000 $</span>
              </div>
            </div>

            {/* Interest rate */}
            <div className="mb-6">
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-accent-500" />
                  Taux d'intérêt annuel
                </span>
                <span className="text-primary-700 font-bold">{interestRate.toFixed(1)} %</span>
              </label>
              <input
                type="range"
                min={3}
                max={20}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-primary-100 rounded-full appearance-none cursor-pointer accent-accent-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3 %</span>
                <span>20 %</span>
              </div>
            </div>

            {/* Term */}
            <div className="mb-2">
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-accent-500" />
                  Durée du prêt
                </span>
                <span className="text-primary-700 font-bold">{termMonths} mois</span>
              </label>
              <input
                type="range"
                min={3}
                max={60}
                step={1}
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full h-2 bg-primary-100 rounded-full appearance-none cursor-pointer accent-accent-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3 mois</span>
                <span>60 mois</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              * Cet outil fournit une estimation seulement. Les termes réels peuvent varier selon votre dossier.
            </p>
          </div>

          {/* Results */}
          <div className="space-y-4 md:space-y-6">
            {/* Monthly payment — main card */}
            <div className="bg-linear-to-br from-primary-700 to-primary-600 rounded-xl md:rounded-2xl p-5 md:p-8 text-center">
              <p className="text-primary-200 text-xs md:text-sm font-medium mb-1">Paiement mensuel estimé</p>
              <p className="text-white text-3xl md:text-5xl font-bold font-serif">
                {formatCurrency(results.monthlyPayment)}
              </p>
              <p className="text-primary-200 text-xs md:text-sm mt-1 md:mt-2">/ mois</p>
            </div>

            {/* Detail cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-white rounded-lg md:rounded-xl shadow-md border border-gray-100 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                  <div className="bg-primary-50 p-1.5 md:p-2 rounded-lg">
                    <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
                  </div>
                  <span className="text-xs md:text-sm text-gray-500">Total à rembourser</span>
                </div>
                <p className="text-lg md:text-2xl font-bold text-primary-700">
                  {formatCurrency(results.totalPayment)}
                </p>
              </div>
              <div className="bg-white rounded-lg md:rounded-xl shadow-md border border-gray-100 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                  <div className="bg-accent-50 p-1.5 md:p-2 rounded-lg">
                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-accent-500" />
                  </div>
                  <span className="text-xs md:text-sm text-gray-500">Intérêts totaux</span>
                </div>
                <p className="text-lg md:text-2xl font-bold text-accent-600">
                  {formatCurrency(results.totalInterest)}
                </p>
              </div>
            </div>

            {/* Visual bar */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-md border border-gray-100 p-4 md:p-6">
              <p className="text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">Répartition du remboursement</p>
              <div className="h-3 md:h-4 rounded-full overflow-hidden flex">
                <div
                  className="bg-primary-600 transition-all duration-500"
                  style={{ width: `${(loanAmount / results.totalPayment) * 100}%` }}
                />
                <div
                  className="bg-accent-400 transition-all duration-500"
                  style={{ width: `${(results.totalInterest / results.totalPayment) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary-600" />
                  Capital ({((loanAmount / results.totalPayment) * 100).toFixed(0)} %)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-accent-400" />
                  Intérêts ({((results.totalInterest / results.totalPayment) * 100).toFixed(0)} %)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
