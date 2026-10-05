export interface TopKPrediction {
  class_index: number;
  raw_class_name: string;
  display_name: string;
  category: string;
  severity: string;
  confidence: number;
  confidence_percent: number;
}

export interface AllClassProbability {
  class_index: number;
  raw_class_name: string;
  display_name: string;
  confidence: number;
  confidence_percent: number;
}

export interface DiseaseProfile {
  id: string;
  name: string;
  scientific_name: string;
  category: string;
  severity: string;
  overview: string;
  symptoms: string[];
  environmental_conditions: {
    optimal_temp: string;
    humidity: string;
    spread_mechanism: string;
  };
  prevention: string[];
  management: string[];
  lookalike_diseases: string[];
  danger_to_crop: string;
}

export interface PredictResponse {
  success: boolean;
  predicted_class_index: number;
  raw_class_name: string;
  display_name: string;
  category: string;
  severity: string;
  confidence: number;
  confidence_percent: number;
  top_k_predictions: TopKPrediction[];
  all_class_probabilities: AllClassProbability[];
  inference_time_ms: number;
  model_name: string;
  model_version: string;
  image_size: [number, number];
  disease_info?: DiseaseProfile;
  gradcam_overlay_url?: string;
  gradcam_heatmap_url?: string;
  saved_record_id?: number;
  warning_notice: string;
}

export interface GradCamResponse {
  success: boolean;
  overlay_base64: string;
  heatmap_base64: string;
  target_class_index?: number;
  heatmap_shape: number[];
  notice: string;
}

export interface HistoryItem {
  id: number;
  created_at: string;
  predicted_class: string;
  raw_class_name: string;
  category: string;
  severity: string;
  confidence: number;
  inference_time_ms: number;
  image_data_url?: string;
  has_gradcam: boolean;
  user_notes?: string;
  is_bookmarked: boolean;
}

export interface HistoryDetail extends HistoryItem {
  top_k_json?: TopKPrediction[];
  all_probabilities_json?: AllClassProbability[];
  gradcam_data_url?: string;
  model_name: string;
  model_version: string;
}

export interface AnalyticsDistributionItem {
  name: string;
  count: number;
  percentage: number;
  category: string;
}

export interface AnalyticsTimelineItem {
  date: string;
  count: number;
}

export interface AnalyticsResponse {
  total_analyses: number;
  category_breakdown: Record<string, number>;
  class_distribution: AnalyticsDistributionItem[];
  timeline: AnalyticsTimelineItem[];
  average_confidence: number;
  average_inference_time_ms: number;
  disclaimer: string;
}

export interface ModelStatusResponse {
  status: "ready" | "model_unavailable" | "error" | "uninitialized";
  is_ready: boolean;
  message: string;
  architecture: string;
  input_resolution: number[];
  num_classes: number;
  has_evaluation_metrics: boolean;
  has_training_history: boolean;
  model_metadata?: {
    model_name: string;
    architecture: string;
    version: string;
    timestamp: string;
    training_params: {
      batch_size: number;
      initial_epochs: number;
      fine_tune_epochs: number;
      initial_learning_rate: number;
      fine_tune_learning_rate: number;
      total_params: number;
      trainable_params: number;
      training_duration_seconds: number;
    };
    dataset_summary: {
      total_samples: number;
      train_samples: number;
      val_samples: number;
      test_samples: number;
      class_distribution: Record<string, number>;
    };
  };
}

export interface PerClassMetric {
  class_index: number;
  class_name: string;
  display_name: string;
  precision: number;
  recall: number;
  f1_score: number;
  support: number;
}

export interface EvaluationMetricsResponse {
  is_available: boolean;
  message?: string;
  metrics?: {
    overall: {
      test_accuracy: number;
      macro_precision: number;
      macro_recall: number;
      macro_f1: number;
      weighted_precision: number;
      weighted_recall: number;
      weighted_f1: number;
      total_test_samples: number;
    };
    per_class: PerClassMetric[];
    confusion_matrix: {
      raw: number[][];
      normalized: number[][];
      labels: string[];
    };
    classification_report: Record<string, any>;
  };
}

export interface TrainingHistoryData {
  epoch: number[];
  loss: number[];
  accuracy: number[];
  val_loss: number[];
  val_accuracy: number[];
  lr: number[];
}

export interface AssistantResponse {
  query: string;
  category: string;
  title: string;
  content: string;
  suggested_questions: string[];
  disclaimer: string;
}
