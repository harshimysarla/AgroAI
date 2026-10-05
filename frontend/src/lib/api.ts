import {
  PredictResponse,
  GradCamResponse,
  DiseaseProfile,
  HistoryItem,
  HistoryDetail,
  AnalyticsResponse,
  ModelStatusResponse,
  EvaluationMetricsResponse,
  AssistantResponse,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 45000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs / 1000}s`);
    }
    throw error;
  }
}

export const api = {
  async getHealth() {
    const res = await fetchWithTimeout(`${API_BASE}/health`);
    if (!res.ok) throw new Error("Health check failed");
    return res.json();
  },

  async getModelStatus(): Promise<ModelStatusResponse> {
    const res = await fetchWithTimeout(`${API_BASE}/model/status`);
    if (!res.ok) throw new Error("Failed to fetch model status");
    return res.json();
  },

  async getModelMetrics(): Promise<EvaluationMetricsResponse> {
    const res = await fetchWithTimeout(`${API_BASE}/model/metrics`);
    if (!res.ok) throw new Error("Failed to fetch model metrics");
    return res.json();
  },

  async getModelTrainingInfo() {
    const res = await fetchWithTimeout(`${API_BASE}/model/training-info`);
    if (!res.ok) throw new Error("Failed to fetch training metadata");
    return res.json();
  },

  async predictLeaf(
    file: File,
    generateGradcam = true,
    saveToHistory = true
  ): Promise<PredictResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("generate_gradcam", String(generateGradcam));
    formData.append("save_to_history", String(saveToHistory));

    const res = await fetchWithTimeout(`${API_BASE}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Prediction request failed with status ${res.status}`);
    }

    return res.json();
  },

  async explainImage(file: File, classIndex?: number, alpha = 0.45): Promise<GradCamResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (classIndex !== undefined) {
      formData.append("class_index", String(classIndex));
    }
    formData.append("alpha", String(alpha));

    const res = await fetchWithTimeout(`${API_BASE}/explain`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Explainability computation failed");
    }

    return res.json();
  },

  async getDiseases(): Promise<DiseaseProfile[]> {
    const res = await fetchWithTimeout(`${API_BASE}/diseases`);
    if (!res.ok) throw new Error("Failed to fetch disease list");
    return res.json();
  },

  async getDiseaseById(id: string): Promise<DiseaseProfile> {
    const res = await fetchWithTimeout(`${API_BASE}/diseases/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Failed to fetch disease '${id}'`);
    return res.json();
  },

  async getHistory(
    limit = 50,
    offset = 0,
    category?: string,
    bookmarkedOnly = false
  ): Promise<HistoryItem[]> {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      bookmarked_only: String(bookmarkedOnly),
    });
    if (category && category !== "All") {
      params.append("category", category);
    }

    const res = await fetchWithTimeout(`${API_BASE}/history?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch analysis history");
    return res.json();
  },

  async getHistoryDetail(id: number): Promise<HistoryDetail> {
    const res = await fetchWithTimeout(`${API_BASE}/history/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch record ${id}`);
    return res.json();
  },

  async updateHistoryNotes(
    id: number,
    notes?: string,
    isBookmarked?: boolean
  ): Promise<HistoryDetail> {
    const res = await fetchWithTimeout(`${API_BASE}/history/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_notes: notes,
        is_bookmarked: isBookmarked,
      }),
    });
    if (!res.ok) throw new Error("Failed to update history note");
    return res.json();
  },

  async deleteHistoryRecord(id: number): Promise<void> {
    const res = await fetchWithTimeout(`${API_BASE}/history/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete record");
  },

  async getAnalytics(): Promise<AnalyticsResponse> {
    const res = await fetchWithTimeout(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
  },

  async queryAssistant(query: string): Promise<AssistantResponse> {
    const res = await fetchWithTimeout(`${API_BASE}/assistant/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error("Assistant request failed");
    return res.json();
  },

  async submitFeedback(payload: {
    prediction_id?: number;
    predicted_class: string;
    user_suggested_class?: string;
    feedback_type: string;
    comments?: string;
  }) {
    const res = await fetchWithTimeout(`${API_BASE}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to submit feedback");
    return res.json();
  },
};
