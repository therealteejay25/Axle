"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { logsAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import {
  ChartLine,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Trash,
} from "@phosphor-icons/react";

interface LogEntry {
  message: string;
  createdAt?: string;
}

interface AgentReport {
  agentId: string;
  agentName: string;
  description?: string;
  model?: string;
  tools?: string[];
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  successRate: string;
  lastRunAt?: string;
  createdAt?: string;
  daysActive?: number;
  recentLogs?: LogEntry[];
}

const AgentLogsPage = () => {
  const params = useParams();
  const agentId = params.id as string;
  const { showToast } = useToast();
  const [report, setReport] = useState<AgentReport | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

  useEffect(() => {
    loadAgentLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  const loadAgentLogs = async () => {
    try {
      setLoading(true);
      const [reportData, logsData] = await Promise.all([
        logsAPI.getAgentReport(agentId),
        logsAPI.getAgentLogs(agentId, 100),
      ]);

      setReport(reportData);
      setLogs(logsData.logs || []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load logs";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm("This will clear all logs for this agent. Continue?")) return;

    try {
      await logsAPI.clearAgentLogs(agentId);
      showToast("Logs cleared successfully", "success");
      loadAgentLogs();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to clear logs";
      showToast(message, "error");
    }
  };

  const successRate = report?.successRate ? parseFloat(report.successRate) : 0;
  const successColor =
    successRate >= 80
      ? "text-green-400"
      : successRate >= 50
      ? "text-yellow-400"
      : "text-red-400";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="loader-light"></div>
        </motion.div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-4">
            Agent not found
          </h1>
          <Link
            href="/app/agents"
            className="text-base hover:text-base/80 transition-colors"
          >
            Back to Agents →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href={`/app/agents/${agentId}`}
            className="flex items-center gap-2 text-base hover:text-base/80 transition-colors mb-4 w-fit"
          >
            <ArrowLeft size={20} />
            Back to Agent
          </Link>
          <h1 className="text-white text-4xl font-bold mb-2">
            {report.agentName}
          </h1>
          <p className="text-white/60 max-w-2xl">
            {report.description ||
              "View detailed execution logs and performance metrics"}
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          {/* Total Executions */}
          <div className="bg-white/4 rounded-3xl p-6 border border-white/10">
            <p className="text-white/60 text-xs font-semibold mb-3">
              Total Executions
            </p>
            <p className="text-white text-3xl font-bold">
              {report.totalExecutions}
            </p>
          </div>

          {/* Successful */}
          <div className="bg-white/4 rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={16} className="text-green-400" />
              <p className="text-white/60 text-xs font-semibold">Successful</p>
            </div>
            <p className="text-green-400 text-3xl font-bold">
              {report.successfulExecutions}
            </p>
          </div>

          {/* Failed */}
          <div className="bg-white/4 rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={16} className="text-red-400" />
              <p className="text-white/60 text-xs font-semibold">Failed</p>
            </div>
            <p className="text-red-400 text-3xl font-bold">
              {report.failedExecutions}
            </p>
          </div>

          {/* Success Rate */}
          <div className="bg-white/4 rounded-3xl p-6 border border-white/10">
            <p className="text-white/60 text-xs font-semibold mb-3">
              Success Rate
            </p>
            <p className={`${successColor} text-3xl font-bold`}>
              {report.successRate}
            </p>
          </div>

          {/* Days Active */}
          <div className="bg-white/4 rounded-3xl p-6 border border-white/10">
            <p className="text-white/60 text-xs font-semibold mb-3">
              Days Active
            </p>
            <p className="text-base text-3xl font-bold">
              {report.daysActive || 0}
            </p>
          </div>
        </motion.div>

        {/* Agent Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/4 rounded-3xl p-6 border border-white/10 mb-8"
        >
          <h2 className="text-white text-xl font-semibold mb-4">
            Agent Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/60 text-sm mb-1">Model</p>
              <p className="text-white font-mono text-sm bg-white/5 p-3 rounded-lg">
                {report.model || "gpt-4o"}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Created</p>
              <p className="text-white text-sm">
                {report.createdAt
                  ? new Date(report.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
            {report.tools && report.tools.length > 0 && (
              <div className="md:col-span-2">
                <p className="text-white/60 text-sm mb-3">Tools</p>
                <div className="flex gap-2 flex-wrap">
                  {report.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="bg-base/20 text-base text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {report.lastRunAt && (
              <div className="md:col-span-2">
                <p className="text-white/60 text-sm mb-1">Last Run</p>
                <p className="text-white text-sm">
                  {new Date(report.lastRunAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-semibold">
              Execution Logs
            </h2>
            <button
              onClick={handleClearLogs}
              disabled={logs.length === 0}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 disabled:text-white/40 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
            >
              <Trash size={16} />
              Clear Logs
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="bg-white/4 rounded-3xl p-12 border border-white/10 text-center">
              <ChartLine size={48} className="text-white/40 mx-auto mb-4" />
              <p className="text-white/50 text-lg">No logs available</p>
              <p className="text-white/30 text-sm mt-2">
                Run this agent to see execution logs
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log, index) => {
                const isError = log.message.toLowerCase().includes("error");
                const isExpanded = expandedLog === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white/4 rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
                  >
                    <button
                      onClick={() => setExpandedLog(isExpanded ? null : index)}
                      className="w-full px-6 py-4 flex items-start justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1 text-left">
                        {isError ? (
                          <XCircle
                            size={20}
                            className="text-red-400 mt-1 flex-shrink-0"
                          />
                        ) : (
                          <CheckCircle
                            size={20}
                            className="text-green-400 mt-1 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium line-clamp-1">
                            {log.message}
                          </p>
                          <p className="text-white/40 text-xs mt-1">
                            {log.createdAt
                              ? new Date(log.createdAt).toLocaleString()
                              : "Recently"}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-4 flex-shrink-0 ${
                          isError
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {isError ? "Error" : "Success"}
                      </div>
                    </button>

                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10 px-6 py-4 bg-white/2"
                      >
                        <div className="bg-white/5 rounded-lg p-4 font-mono text-xs text-white/70 break-all whitespace-pre-wrap max-h-60 overflow-y-auto">
                          {log.message}
                        </div>
                        {log.createdAt && (
                          <p className="text-white/40 text-xs mt-3">
                            Full timestamp:{" "}
                            {new Date(log.createdAt).toISOString()}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AgentLogsPage;
