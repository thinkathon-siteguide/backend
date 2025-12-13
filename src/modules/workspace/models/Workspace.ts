import { Schema, model, Document } from 'mongoose';

export interface IResourceItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  status: 'Good' | 'Low' | 'Critical';
}

export interface IArchitectureStage {
  name: string;
  description: string;
  duration: string;
}

export interface IArchitecturePlan {
  costEstimate: string;
  timeline: string;
  materials: string[];
  stages: IArchitectureStage[];
  summary: string;
}

export interface IHazard {
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  recommendation: string;
}

export interface ISafetyReport {
  id: string;
  date: string;
  riskScore: number;
  hazards: IHazard[];
  summary: string;
}

export interface IWorkspace extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  location: string;
  stage: string;
  type: string;
  budget: string;
  status: 'Under Construction' | 'Finished';
  progress: number;
  safetyScore: number;
  lastUpdated: Date;
  resources: IResourceItem[];
  architecturePlan?: IArchitecturePlan;
  safetyReports: ISafetyReport[];
  createdAt: Date;
  updatedAt: Date;
}

const resourceItemSchema = new Schema<IResourceItem>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  threshold: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    required: true,
    enum: ['Good', 'Low', 'Critical'],
    default: 'Good',
  },
}, { _id: false });

const architectureStageSchema = new Schema<IArchitectureStage>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
}, { _id: false });

const architecturePlanSchema = new Schema<IArchitecturePlan>({
  costEstimate: { type: String, required: true },
  timeline: { type: String, required: true },
  materials: [{ type: String }],
  stages: [architectureStageSchema],
  summary: { type: String, required: true },
}, { _id: false });

const hazardSchema = new Schema<IHazard>({
  description: { type: String, required: true },
  severity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High'],
  },
  recommendation: { type: String, required: true },
}, { _id: false });

const safetyReportSchema = new Schema<ISafetyReport>({
  id: { type: String, required: true },
  date: { type: String, required: true },
  riskScore: { type: Number, required: true, min: 0, max: 100 },
  hazards: [hazardSchema],
  summary: { type: String, required: true },
}, { _id: false });

const workspaceSchema = new Schema<IWorkspace>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    stage: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Under Construction', 'Finished'],
      default: 'Under Construction',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    safetyScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    resources: {
      type: [resourceItemSchema],
      default: [],
    },
    architecturePlan: {
      type: architecturePlanSchema,
      required: false,
    },
    safetyReports: {
      type: [safetyReportSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

workspaceSchema.pre('save', function (next: any) {
  this.lastUpdated = new Date();
  next();
});

workspaceSchema.pre('findOneAndUpdate', function (next: any) {
  this.set({ lastUpdated: new Date() });
  next();
});

export const Workspace = model<IWorkspace>('Workspace', workspaceSchema);

