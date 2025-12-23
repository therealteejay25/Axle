"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { logsAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import {
  ChartLine,
  CheckCircle,
  XCircle,
  Clock,
  Sparkle,
} from "@phosphor-icons/react";

interface LogEntry {
  agentId?: string;
  agentName?: string;
  message: string;
  createdAt?: string;
}

interface AgentReport {
  agentId: string;
  agentName: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  successRate: string;
  lastRunAt?: string;
}

interface Insight {
  agentId: string;
  agentName: string;
  totalExecutions: number;
  errorCount: number;
  errorRate: string;
  recommendations: string[];
  lastActivity?: string;
}

const DashboardPage = () => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [reports, setReports] = useState<AgentReport[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"logs" | "reports" | "insights">(
    "logs"
  );
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [logsData, reportsData, insightsData] = await Promise.all([
        logsAPI.getAllLogs(100),
        logsAPI.getAllReports(),
        logsAPI.getInsights(),
      ]);

      setLogs(logsData.logs || []);
      setReports(reportsData.agentReports || []);
      setInsights(insightsData.agentInsights || []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load dashboard data";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = selectedAgent
    ? logs.filter((log) => log.agentId === selectedAgent)
    : logs;

  const filteredReports = selectedAgent
    ? reports.filter((r) => r.agentId === selectedAgent)
    : reports;

  const filteredInsights = selectedAgent
    ? insights.filter((i) => i.agentId === selectedAgent)
    : insights;

  const totalStats = {
    totalLogs: logs.length,
    totalExecutions: reports.reduce((sum, r) => sum + r.totalExecutions, 0),
    totalSuccessful: reports.reduce(
      (sum, r) => sum + r.successfulExecutions,
      0
    ),
    totalFailed: reports.reduce((sum, r) => sum + r.failedExecutions, 0),
  };

  const overallSuccessRate =
    totalStats.totalExecutions > 0
      ? (
          (totalStats.totalSuccessful / totalStats.totalExecutions) *
          100
        ).toFixed(2)
      : "0";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#000]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="loader-light"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000]">
      <div className="px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-white text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-white/60">
            Monitor your AI agents' execution logs and performance metrics
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Executions */}
          <div className="bg-white/4 rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/80 text-sm font-semibold">
                Total Executions
              </h3>
              <ChartLine size={24} className="text-base" />
            </div>
            <p className="text-white text-3xl font-bold">
              {totalStats.totalExecutions}
            </p>
            <p className="text-white/40 text-xs mt-2">Total agent runs</p>
          </div>

          {/* Successful Runs */}
          <div className="bg-white/4 rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/80 text-sm font-semibold">
                Successful
              </h3>
              <CheckCircle size={24} className="text-green-500" />
            </div>
            <p className="text-white text-3xl font-bold">
              {totalStats.totalSuccessful}
            </p>
            <p className="text-white/40 text-xs mt-2">
              Success rate: {overallSuccessRate}%
            </p>
          </div>

          {/* Failed Runs */}
          <div className="bg-white/4 rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/80 text-sm font-semibold">Failed</h3>
              <XCircle size={24} className="text-red-500" />
            </div>
            <p className="text-white text-3xl font-bold">
              {totalStats.totalFailed}
            </p>
            <p className="text-white/40 text-xs mt-2">
              {totalStats.totalExecutions > 0
                ? (
                    (totalStats.totalFailed / totalStats.totalExecutions) *
                    100
                  ).toFixed(2) + "%"
                : "0%"}
            </p>
          </div>

          {/* Recent Logs */}
          <div className="bg-white/4 rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/80 text-sm font-semibold">
                Recent Logs
              </h3>
              <Clock size={24} className="text-base" />
            </div>
            <p className="text-white text-3xl font-bold">
              {totalStats.totalLogs}
            </p>
            <p className="text-white/40 text-xs mt-2">Log entries</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-4 border-b border-white/10">
            {["logs", "reports", "insights"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "logs" | "reports" | "insights")
                }
                className={`px-6 py-3 font-semibold text-sm transition-all capitalize ${
                  activeTab === tab
                    ? "text-base border-b-2 border-base"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Agent Filter */}
          {(reports.length > 0 || insights.length > 0) && (
            <div className="mb-6">
              <p className="text-white/60 text-sm mb-3">Filter by Agent:</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedAgent === null
                      ? "bg-base text-white"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  All Agents
                </button>
                {reports.map((report) => (
                  <button
                    key={report.agentId}
                    onClick={() => setSelectedAgent(report.agentId)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all truncate max-w-[200px] ${
                      selectedAgent === report.agentId
                        ? "bg-base text-white"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {report.agentName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <div className="space-y-4">
              {filteredLogs.length === 0 ? (
                <div className="bg-white/4 rounded-3xl p-8 border border-white/10 text-center">
                  <p className="text-white/50">No logs available</p>
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/4 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {log.agentName && (
                          <p className="text-base font-semibold mb-1">
                            {log.agentName}
                          </p>
                        )}
                        <p className="text-white text-sm">{log.message}</p>
                        <p className="text-white/40 text-xs mt-2">
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString()
                            : "Recently"}
                        </p>
                      </div>
                      <div
                        className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-4 ${
                          log.message.toLowerCase().includes("error")
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {log.message.toLowerCase().includes("error")
                          ? "Error"
                          : "Success"}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="bg-white/4 rounded-3xl p-8 border border-white/10 text-center">
                  <p className="text-white/50">No reports available</p>
                </div>
              ) : (
                filteredReports.map((report, index) => (
                  <motion.div
                    key={report.agentId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/4 rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white text-lg font-semibold">
                          {report.agentName}
                        </h3>
                        <p className="text-white/40 text-sm">
                          {report.totalExecutions} total executions
                        </p>
                      </div>
                      <Link
                        href={`/app/agents/${report.agentId}/logs`}
                        className="text-base hover:text-base/80 transition-colors text-sm font-semibold"
                      >
                        View Details →
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-2xl p-4">
                        <p className="text-white/60 text-xs mb-2">Successful</p>
                        <p className="text-green-400 text-2xl font-bold">
                          {report.successfulExecutions}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4">
                        <p className="text-white/60 text-xs mb-2">Failed</p>
                        <p className="text-red-400 text-2xl font-bold">
                          {report.failedExecutions}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4">
                        <p className="text-white/60 text-xs mb-2">
                          Success Rate
                        </p>
                        <p className="text-base text-2xl font-bold">
                          {report.successRate}
                        </p>
                      </div>
                    </div>

                    {report.lastRunAt && (
                      <p className="text-white/40 text-xs mt-4">
                        Last run: {new Date(report.lastRunAt).toLocaleString()}
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === "insights" && (
            <div className="space-y-4">
              {filteredInsights.length === 0 ? (
                <div className="bg-white/4 rounded-3xl p-8 border border-white/10 text-center">
                  <p className="text-white/50">No insights available</p>
                </div>
              ) : (
                filteredInsights.map((insight, index) => (
                  <motion.div
                    key={insight.agentId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/4 rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white text-lg font-semibold">
                          {insight.agentName}
                        </h3>
                        <p className="text-white/40 text-sm">
                          {insight.totalExecutions} total executions,{" "}
                          {insight.errorCount} errors
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Error Rate</p>
                        <p
                          className={`text-2xl font-bold ${
                            parseFloat(insight.errorRate) > 50
                              ? "text-red-400"
                              : parseFloat(insight.errorRate) > 25
                              ? "text-yellow-400"
                              : "text-green-400"
                          }`}
                        >
                          {insight.errorRate}
                        </p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-2 mt-4">
                      {insight.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="bg-white/5 rounded-2xl p-3 flex items-start gap-3"
                        >
                          <Sparkle
                            size={16}
                            className="text-base mt-0.5 flex-shrink-0"
                          />
                          <p className="text-white/80 text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>

                    {insight.lastActivity && (
                      <p className="text-white/40 text-xs mt-4">
                        Last activity:{" "}
                        {new Date(insight.lastActivity).toLocaleString()}
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
