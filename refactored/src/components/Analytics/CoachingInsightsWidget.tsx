import React from 'react';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  Users,
  BarChart3,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { CoachingInsights } from '../../types';
import { Card } from '../ui/Card';

interface CoachingInsightsWidgetProps {
  insights: CoachingInsights;
}

export const CoachingInsightsWidget: React.FC<CoachingInsightsWidgetProps> = ({
  insights
}) => {
  const getEffectivenessColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overall Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-bold text-gray-100">Coaching Performance</h3>
          </div>
          <div className={`text-2xl font-bold ${getEffectivenessColor(insights.overallTeachingEffectiveness)}`}>
            {(insights.overallTeachingEffectiveness * 100).toFixed(0)}%
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-blue-400">{insights.totalPractices}</div>
              <div className="text-gray-400 text-xs">Total Practices</div>
            </div>
            
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-purple-400">{insights.totalEvaluations}</div>
              <div className="text-gray-400 text-xs">Evaluations Given</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Teaching Effectiveness</span>
              <span>{(insights.overallTeachingEffectiveness * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${insights.overallTeachingEffectiveness * 100}%` }}
              />
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm">
            <div className="flex items-center justify-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Average session: {insights.averageSessionLength} minutes</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Strengths & Development Areas */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-bold text-gray-100">Growth Areas</h3>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-100 mb-2 text-sm flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-green-500" />
              Your Coaching Strengths
            </h4>
            <div className="space-y-2">
              {insights.coachingStrengths.slice(0, 3).map((strength, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-300 text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-100 mb-2 text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
              Areas for Development
            </h4>
            <div className="space-y-2">
              {insights.areasForDevelopment.slice(0, 3).map((area, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-yellow-300 text-sm">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Activity Timeline */}
      <Card className="p-6 lg:col-span-2">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-100">Monthly Activity</h3>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {insights.monthlyActivity.slice(-6).map((month, index) => (
            <div key={index} className="text-center">
              <div className="mb-2">
                <div className="text-sm font-medium text-gray-100">{month.month}</div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <div className="bg-gray-700 rounded-full h-20 w-8 mx-auto flex flex-col justify-end overflow-hidden">
                    <div
                      className="bg-blue-500 rounded-b-full transition-all duration-500"
                      style={{ height: `${Math.min((month.practices / 20) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-blue-400 mt-1">{month.practices}p</div>
                </div>
                
                <div className="relative">
                  <div className="bg-gray-700 rounded-full h-16 w-6 mx-auto flex flex-col justify-end overflow-hidden">
                    <div
                      className="bg-purple-500 rounded-b-full transition-all duration-500"
                      style={{ height: `${Math.min((month.evaluations / 50) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-purple-400 mt-1">{month.evaluations}e</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-gray-400 text-sm">Practices</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span className="text-gray-400 text-sm">Evaluations</span>
          </div>
        </div>
      </Card>
    </div>
  );
};