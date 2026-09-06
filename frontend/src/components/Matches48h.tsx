// 🎨 FRONTEND - React Component برای نمایش بازی‌های 48 ساعت

'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

interface Match {
  id: string;
  tournament: string;
  home_team: string;
  away_team: string;
  match_time: string;
  status: 'scheduled' | 'live' | 'finished';
  league: string;
  stadium?: string;
}

export function Matches48hComponent() {
  const [filter, setFilter] = useState<'all' | 'today' | 'tomorrow' | 'live'>('all');
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState<any>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Fetch data based on filter
  const fetchMatches = async () => {
    try {
      let endpoint = `${apiUrl}/api/v1/matches/48h`;
      
      if (filter === 'today') {
        endpoint = `${apiUrl}/api/v1/matches/48h/today`;
      } else if (filter === 'tomorrow') {
        endpoint = `${apiUrl}/api/v1/matches/48h/tomorrow`;
      } else if (filter === 'live') {
        endpoint = `${apiUrl}/api/v1/matches/48h/live`;
      }

      const response = await axios.get(endpoint);
      setMatches(response.data.data.matches || []);
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [filter]);

  const getStatusBadgeColor = (status: string) => {
    if (status === 'live') return 'bg-red-500 animate-pulse';
    if (status === 'finished') return 'bg-green-500';
    return 'bg-blue-500';
  };

  const groupByLeague = (matches: Match[]) => {
    const grouped: Record<string, Match[]> = {};
    matches.forEach(match => {
      if (!grouped[match.league]) grouped[match.league] = [];
      grouped[match.league].push(match);
    });
    return grouped;
  };

  const groupedMatches = groupByLeague(matches);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">⚽ Next 48 Hours Matches</h1>
        <p className="text-gray-600">All football matches worldwide for the next 48 hours</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'today', 'tomorrow', 'live'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Matches</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.scheduled}</div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 animate-pulse">
            <div className="text-2xl font-bold text-red-600">{stats.live}</div>
            <div className="text-sm text-gray-600">Live Now</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{stats.finished}</div>
            <div className="text-sm text-gray-600">Finished</div>
          </div>
        </div>
      )}

      {/* Matches by League */}
      <div className="space-y-6">
        {Object.entries(groupedMatches).map(([league, leagueMatches]) => (
          <div key={league} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
              <span className="text-2xl mr-2">🏆</span>
              {league}
            </h2>
            
            <div className="space-y-3">
              {leagueMatches.map(match => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  {/* Match Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 text-right">
                        <div className="font-semibold">{match.home_team}</div>
                      </div>
                      <div className="px-3 text-center">
                        <div className="text-sm text-gray-500">vs</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{match.away_team}</div>
                      </div>
                    </div>
                  </div>

                  {/* Time & Status */}
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-sm text-gray-600 text-right">
                      <div className="font-semibold">
                        {new Date(match.match_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-xs">
                        {new Date(match.match_time).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getStatusBadgeColor(match.status)}`}>
                      {match.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No matches found</p>
        </div>
      )}
    </div>
  );
}
