import type { JsonObject, JsonPath, JsonValue, PathSegment } from '@shapeshift-labs/frontier';
import {
  createFrontierRegistryGraph,
  frontierRegistryImpact,
  normalizeFrontierRegistryPath,
  type FrontierRegistryEdge,
  type FrontierRegistryEntry,
  type FrontierRegistryGraph,
  type FrontierRegistryImpact,
  type FrontierRegistryImpactInput,
  type FrontierRegistryPath,
  type FrontierRegistryRecord,
  type FrontierRegistrySource
} from '@shapeshift-labs/frontier/registry';

export const FRONTIER_VIEW_MANIFEST_KIND = 'frontier.view.manifest';
export const FRONTIER_VIEW_MANIFEST_VERSION = 1;
export const FRONTIER_VIEW_FRAME_KIND = 'frontier.view.frame';
export const FRONTIER_VIEW_FRAME_VERSION = 1;
export const FRONTIER_VIEW_QUERY_KIND = 'frontier.view.query';
export const FRONTIER_VIEW_QUERY_VERSION = 1;
export const FRONTIER_VIEW_IMPACT_KIND = 'frontier.view.impact';
export const FRONTIER_VIEW_IMPACT_VERSION = 1;
export const FRONTIER_VIEW_JSONL_KIND = 'frontier.view.jsonl';
export const FRONTIER_VIEW_JSONL_VERSION = 1;
export const FRONTIER_VIEW_PROOF_KIND = 'frontier.view.proof';
export const FRONTIER_VIEW_PROOF_VERSION = 1;

export type FrontierViewJsonType =
  | 'null'
  | 'boolean'
  | 'integer'
  | 'number'
  | 'string'
  | 'array'
  | 'object'
  | 'enum'
  | 'unknown'
  | string;

export type FrontierViewMode = 'editable' | 'readonly' | 'disabled' | 'hidden' | string;
export type FrontierViewTarget = 'any' | 'dom' | 'react' | 'native' | 'svg' | 'canvas' | 'webgl' | 'webgpu' | 'shader' | 'server' | string;
export type FrontierViewDiagnosticSeverity = 'error' | 'warning';
export type FrontierViewValidationTrigger = 'parse' | 'field' | 'schema' | 'cross-field' | 'action' | 'effect' | string;
export type FrontierViewValidationStrategy = 'none' | 'field' | 'all' | 'eager' | string;
export type FrontierViewActionStatus = 'ready' | 'blocked' | 'pending' | string;

export interface FrontierViewSchemaLike {
  type?: string | readonly string[];
  title?: string;
  description?: string;
  format?: string;
  properties?: Record<string, FrontierViewSchemaLike>;
  required?: readonly string[];
  items?: FrontierViewSchemaLike | readonly FrontierViewSchemaLike[];
  enum?: readonly JsonValue[];
  const?: JsonValue;
  readOnly?: boolean;
  writeOnly?: boolean;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  pattern?: string;
  multipleOf?: number;
  [keyword: string]: unknown;
}

export interface FrontierViewSourceInput {
  path?: FrontierRegistryPath;
  schema?: FrontierViewSchemaLike;
  query?: unknown;
  entity?: unknown;
  metadata?: unknown;
}

export interface FrontierViewSource {
  path?: string;
  schema?: FrontierViewSchemaLike;
  query?: JsonValue;
  entity?: JsonValue;
  metadata?: JsonObject;
}

export interface FrontierViewCondition {
  path?: FrontierRegistryPath;
  equals?: JsonValue;
  exists?: boolean;
  capability?: string;
  capabilities?: readonly string[];
  all?: readonly FrontierViewCondition[];
  any?: readonly FrontierViewCondition[];
  not?: FrontierViewCondition;
}

export interface FrontierViewValidationStepInput {
  id?: string;
  kind?: FrontierViewValidationTrigger;
  code?: string;
  path?: FrontierRegistryPath;
  message?: string;
  severity?: FrontierViewDiagnosticSeverity;
  requires?: FrontierViewCondition;
  metadata?: unknown;
}

export interface FrontierViewValidationStep {
  id: string;
  kind: FrontierViewValidationTrigger;
  code: string;
  path?: string;
  message?: string;
  severity: FrontierViewDiagnosticSeverity;
  requires?: FrontierViewCondition;
  metadata?: JsonObject;
}

export type FrontierViewValidationStepLike = string | FrontierViewValidationStepInput;

export interface FrontierViewMappingInput {
  from?: FrontierRegistryPath;
  value?: unknown;
  diff?: readonly [FrontierRegistryPath, FrontierRegistryPath];
  pointer?: FrontierRegistryPath;
}

export interface FrontierViewActionInput {
  id?: string;
  action?: string;
  label?: string;
  event?: string;
  mode?: FrontierViewMode;
  input?: unknown;
  requiresValid?: boolean;
  requiresDirty?: boolean;
  capabilities?: readonly string[];
  reads?: readonly FrontierRegistryPath[];
  writes?: readonly FrontierRegistryPath[];
  calls?: readonly string[];
  effects?: readonly string[];
  triggers?: readonly string[];
  invalidates?: readonly string[];
  affects?: readonly string[];
  tags?: readonly string[];
  source?: FrontierRegistrySource;
  metadata?: unknown;
}

export interface FrontierViewAction {
  id: string;
  action: string;
  label?: string;
  event?: string;
  mode: FrontierViewMode;
  input?: JsonValue;
  requiresValid: boolean;
  requiresDirty: boolean;
  capabilities: string[];
  reads: string[];
  writes: string[];
  calls: string[];
  effects: string[];
  triggers: string[];
  invalidates: string[];
  affects: string[];
  tags: string[];
  source?: FrontierRegistrySource;
  metadata?: JsonObject;
}

export interface FrontierViewChannelInput {
  from?: FrontierRegistryPath;
  value?: unknown;
  scale?: string;
  domain?: readonly JsonValue[];
  range?: readonly JsonValue[];
  sort?: string;
  aggregate?: string;
  axis?: unknown;
  legend?: unknown;
  transform?: unknown;
  updateTriggers?: readonly string[];
  metadata?: unknown;
}

export interface FrontierViewChannel {
  from?: string;
  value?: JsonValue;
  scale?: string;
  domain: JsonValue[];
  range: JsonValue[];
  sort?: string;
  aggregate?: string;
  axis?: JsonObject;
  legend?: JsonObject;
  transform?: JsonValue;
  updateTriggers: string[];
  metadata?: JsonObject;
}

export interface FrontierViewVirtualHintInput {
  keyBy?: string;
  count?: number;
  itemSize?: number;
  estimatedSize?: number;
  overscan?: number;
  lanes?: number;
  gap?: number;
  paddingStart?: number;
  paddingEnd?: number;
  scrollPaddingStart?: number;
  scrollPaddingEnd?: number;
  scrollMargin?: number;
  initialOffset?: number;
  horizontal?: boolean;
  enabled?: boolean;
  measureKey?: string;
  rangeExtractor?: string;
  sticky?: readonly string[];
  viewport?: unknown;
  axis?: 'x' | 'y' | 'both' | string;
  rangePath?: FrontierRegistryPath;
  anchorPath?: FrontierRegistryPath;
  metadata?: unknown;
}

export interface FrontierViewVirtualHint {
  keyBy?: string;
  count?: number;
  itemSize?: number;
  estimatedSize?: number;
  overscan?: number;
  lanes?: number;
  gap?: number;
  paddingStart?: number;
  paddingEnd?: number;
  scrollPaddingStart?: number;
  scrollPaddingEnd?: number;
  scrollMargin?: number;
  initialOffset?: number;
  horizontal?: boolean;
  enabled?: boolean;
  measureKey?: string;
  rangeExtractor?: string;
  sticky: string[];
  viewport?: JsonValue;
  axis?: string;
  rangePath?: string;
  anchorPath?: string;
  metadata?: JsonObject;
}

export interface FrontierViewLodHintInput {
  profile?: string;
  level?: string | number;
  levels?: readonly string[];
  significance?: FrontierRegistryPath;
  observer?: FrontierRegistryPath;
  budget?: unknown;
  priority?: number;
  cost?: number;
  minZoom?: number;
  maxZoom?: number;
  hysteresis?: number;
  degrade?: string;
  variants?: Record<string, string>;
  metadata?: unknown;
}

export interface FrontierViewLodHint {
  profile?: string;
  level?: string | number;
  levels: string[];
  significance?: string;
  observer?: string;
  budget?: JsonValue;
  priority?: number;
  cost?: number;
  minZoom?: number;
  maxZoom?: number;
  hysteresis?: number;
  degrade?: string;
  variants: Record<string, string>;
  metadata?: JsonObject;
}

export interface FrontierViewRepresentationInput {
  id?: string;
  kind?: string;
  target?: FrontierViewTarget;
  channels?: Record<string, FrontierViewChannelInput>;
  variants?: Record<string, string>;
  material?: unknown;
  shader?: unknown;
  attributes?: unknown;
  virtual?: FrontierViewVirtualHintInput;
  lod?: FrontierViewLodHintInput;
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierViewRepresentation {
  id: string;
  kind: string;
  target: FrontierViewTarget;
  channels: Record<string, FrontierViewChannel>;
  variants: Record<string, string>;
  material?: JsonValue;
  shader?: JsonValue;
  attributes?: JsonValue;
  virtual?: FrontierViewVirtualHint;
  lod?: FrontierViewLodHint;
  tags: string[];
  metadata?: JsonObject;
}

export interface FrontierViewDefaultInput {
  representation?: string | FrontierViewRepresentationInput;
  mode?: FrontierViewMode;
  target?: FrontierViewTarget;
  validate?: readonly FrontierViewValidationStepLike[];
  metadata?: unknown;
}

export interface FrontierViewDefault {
  key: string;
  representation: FrontierViewRepresentation;
  mode?: FrontierViewMode;
  validate: FrontierViewValidationStep[];
  metadata?: JsonObject;
}

export type FrontierViewDefaultsInput = Record<string, string | FrontierViewDefaultInput> | readonly FrontierViewDefaultInput[];

export interface FrontierViewFieldInput {
  id?: string;
  path?: FrontierRegistryPath;
  sourcePath?: FrontierRegistryPath;
  writePath?: FrontierRegistryPath;
  schemaPath?: FrontierRegistryPath;
  label?: string;
  description?: string;
  type?: FrontierViewJsonType;
  format?: string;
  enum?: readonly JsonValue[];
  required?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  mode?: FrontierViewMode;
  representation?: string | FrontierViewRepresentationInput;
  channels?: Record<string, FrontierViewChannelInput>;
  visibleWhen?: FrontierViewCondition;
  editableWhen?: FrontierViewCondition;
  validate?: readonly FrontierViewValidationStepLike[];
  actions?: Record<string, FrontierViewActionInput> | readonly FrontierViewActionInput[];
  virtual?: FrontierViewVirtualHintInput;
  lod?: FrontierViewLodHintInput;
  order?: number;
  feature?: string;
  package?: string;
  owner?: string;
  source?: FrontierRegistrySource;
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierViewField {
  id: string;
  path: string;
  sourcePath: string;
  writePath?: string;
  schemaPath?: string;
  label: string;
  description?: string;
  type: FrontierViewJsonType;
  format?: string;
  enum: JsonValue[];
  required: boolean;
  readOnly: boolean;
  writeOnly: boolean;
  mode?: FrontierViewMode;
  representation?: FrontierViewRepresentation;
  channels: Record<string, FrontierViewChannel>;
  visibleWhen?: FrontierViewCondition;
  editableWhen?: FrontierViewCondition;
  validate: FrontierViewValidationStep[];
  actions: FrontierViewAction[];
  virtual?: FrontierViewVirtualHint;
  lod?: FrontierViewLodHint;
  order: number;
  feature?: string;
  package?: string;
  owner?: string;
  source?: FrontierRegistrySource;
  tags: string[];
  metadata?: JsonObject;
}

export interface FrontierViewFlowInput {
  id?: string;
  label?: string;
  mode?: FrontierViewMode;
  draftFrom?: FrontierRegistryPath;
  draftPath?: FrontierRegistryPath;
  validate?: readonly FrontierViewValidationStepLike[];
  fields?: Record<string, FrontierViewFieldInput>;
  actions?: Record<string, FrontierViewActionInput> | readonly FrontierViewActionInput[];
  submit?: FrontierViewActionInput;
  virtual?: FrontierViewVirtualHintInput;
  lod?: FrontierViewLodHintInput;
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierViewFlow {
  id: string;
  label?: string;
  mode?: FrontierViewMode;
  draftFrom?: string;
  draftPath?: string;
  validate: FrontierViewValidationStep[];
  fieldOverrides: Record<string, FrontierViewFieldInput>;
  actions: FrontierViewAction[];
  submit?: FrontierViewAction;
  virtual?: FrontierViewVirtualHint;
  lod?: FrontierViewLodHint;
  tags: string[];
  metadata?: JsonObject;
}

export interface FrontierViewManifestInput {
  id: string;
  name?: string;
  description?: string;
  source?: FrontierViewSourceInput;
  defaults?: FrontierViewDefaultsInput;
  fields?: Record<string, FrontierViewFieldInput> | readonly FrontierViewFieldInput[];
  flows?: Record<string, FrontierViewFlowInput> | readonly FrontierViewFlowInput[];
  representations?: Record<string, string | FrontierViewRepresentationInput> | readonly FrontierViewRepresentationInput[];
  generatedAt?: number;
  package?: string;
  feature?: string;
  owner?: string;
  sourceLocation?: FrontierRegistrySource;
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierViewManifest {
  kind: typeof FRONTIER_VIEW_MANIFEST_KIND;
  version: typeof FRONTIER_VIEW_MANIFEST_VERSION;
  id: string;
  name: string;
  description?: string;
  source?: FrontierViewSource;
  defaults: Record<string, FrontierViewDefault>;
  fields: FrontierViewField[];
  flows: FrontierViewFlow[];
  representations: Record<string, FrontierViewRepresentation>;
  generatedAt?: number;
  package?: string;
  feature?: string;
  owner?: string;
  sourceLocation?: FrontierRegistrySource;
  tags: string[];
  diagnostics: FrontierViewDiagnostic[];
  summary: FrontierViewSummary;
  metadata?: JsonObject;
}

export interface FrontierViewDiagnostic {
  severity: FrontierViewDiagnosticSeverity;
  code: string;
  message: string;
  viewId?: string;
  fieldId?: string;
  actionId?: string;
  path?: string;
  source?: string;
  metadata?: JsonObject;
}

export interface FrontierViewSummary {
  fieldCount: number;
  actionCount: number;
  representationCount: number;
  flowCount: number;
  sourcePathCount: number;
  writePathCount: number;
  editableCount: number;
  readonlyCount: number;
  hiddenCount: number;
  issueCount: number;
  errorCount: number;
  warningCount: number;
}

export interface FrontierViewMaterializeOptions {
  state?: JsonValue;
  flow?: string;
  capabilities?: readonly string[];
  validation?: FrontierViewValidationStrategy;
  includeHidden?: boolean;
  generatedAt?: number;
  metadata?: unknown;
}

export interface FrontierViewNode {
  id: string;
  fieldId: string;
  path: string;
  sourcePath: string;
  writePath?: string;
  label: string;
  description?: string;
  type: FrontierViewJsonType;
  format?: string;
  representation: FrontierViewRepresentation;
  mode: FrontierViewMode;
  editable: boolean;
  readonly: boolean;
  hidden: boolean;
  disabled: boolean;
  required: boolean;
  value?: JsonValue;
  sourceValue?: JsonValue;
  dirty: boolean;
  issues: FrontierViewIssue[];
  actions: FrontierViewActionFrame[];
  channels: Record<string, FrontierViewChannel>;
  virtual?: FrontierViewVirtualHint;
  lod?: FrontierViewLodHint;
  order: number;
  tags: string[];
  metadata?: JsonObject;
}

export interface FrontierViewIssue {
  path: string;
  fieldId?: string;
  actionId?: string;
  code: string;
  message: string;
  severity: FrontierViewDiagnosticSeverity;
  source: string;
  metadata?: JsonObject;
}

export interface FrontierViewActionFrame {
  id: string;
  action: string;
  event?: string;
  label?: string;
  status: FrontierViewActionStatus;
  ready: boolean;
  blockedReasons: string[];
  input?: JsonValue;
  reads: string[];
  writes: string[];
  effects: string[];
  triggers: string[];
  tags: string[];
  metadata?: JsonObject;
}

export interface FrontierViewFrame {
  kind: typeof FRONTIER_VIEW_FRAME_KIND;
  version: typeof FRONTIER_VIEW_FRAME_VERSION;
  manifestId: string;
  flow?: string;
  generatedAt?: number;
  nodes: FrontierViewNode[];
  actions: FrontierViewActionFrame[];
  issues: FrontierViewIssue[];
  summary: FrontierViewSummary;
  metadata?: JsonObject;
}

export interface FrontierViewQueryInput {
  ids?: readonly string[];
  paths?: readonly FrontierRegistryPath[];
  writePaths?: readonly FrontierRegistryPath[];
  representations?: readonly string[];
  flows?: readonly string[];
  features?: readonly string[];
  packages?: readonly string[];
  tags?: readonly string[];
  actions?: readonly string[];
  text?: string;
  limit?: number;
}

export interface FrontierViewQueryResult {
  kind: typeof FRONTIER_VIEW_QUERY_KIND;
  version: typeof FRONTIER_VIEW_QUERY_VERSION;
  query: FrontierViewQueryInput;
  summary: FrontierViewSummary;
  fields: FrontierViewField[];
  flows: FrontierViewFlow[];
  actions: FrontierViewAction[];
  representations: FrontierViewRepresentation[];
}

export interface FrontierViewImpactInput extends FrontierRegistryImpactInput {
  fields?: readonly string[];
  actions?: readonly string[];
  representations?: readonly string[];
  query?: FrontierViewQueryInput;
}

export interface FrontierViewImpact {
  kind: typeof FRONTIER_VIEW_IMPACT_KIND;
  version: typeof FRONTIER_VIEW_IMPACT_VERSION;
  seeds: string[];
  nodes: string[];
  viewIds: string[];
  fieldIds: string[];
  actionIds: string[];
  representations: string[];
  paths: string[];
  writePaths: string[];
  features: string[];
  packages: string[];
  tags: string[];
  registry: FrontierRegistryImpact;
}

export interface FrontierViewRecordInput {
  id?: string;
  viewId: string;
  fieldId?: string;
  actionId?: string;
  causeId?: string;
  parentId?: string;
  status?: FrontierViewActionStatus;
  startedAt?: number;
  endedAt?: number;
  durationMs?: number;
  input?: unknown;
  output?: unknown;
  reads?: readonly FrontierRegistryPath[];
  writes?: readonly FrontierRegistryPath[];
  affected?: readonly string[];
  metadata?: unknown;
  error?: string;
}

export interface FrontierViewProof {
  kind: typeof FRONTIER_VIEW_PROOF_KIND;
  version: typeof FRONTIER_VIEW_PROOF_VERSION;
  generatedAt: number;
  manifestId: string;
  hash: string;
  summary: FrontierViewSummary;
}

const DEFAULT_REPRESENTATIONS: Record<string, string> = {
  unknown: 'json.inspector',
  null: 'value.null',
  boolean: 'field.toggle',
  integer: 'field.number',
  number: 'field.number',
  string: 'field.text',
  email: 'field.email',
  uri: 'field.url',
  date: 'field.date',
  time: 'field.time',
  'date-time': 'field.datetime',
  enum: 'field.select',
  array: 'collection.list',
  object: 'group.section'
};

const PATH_CACHE_LIMIT = 4096;
const PATTERN_CACHE_LIMIT = 512;

const pathSegmentCache = new Map<string, JsonPath>();
const patternCache = new Map<string, RegExp | null>();
const viewIndexCache = new WeakMap<FrontierViewManifest, FrontierViewIndex>();
const registryGraphCache = new WeakMap<FrontierViewManifest, FrontierRegistryGraph>();
const proofHashCache = new WeakMap<FrontierViewManifest, string>();
const jsonlCache = new WeakMap<FrontierViewManifest, string>();
const redactedManifestCache = new WeakMap<FrontierViewManifest, Map<string, FrontierViewManifest>>();

interface FrontierViewIndex {
  fieldsById: Map<string, FrontierViewField>;
  fieldsBySourcePath: Map<string, FrontierViewField[]>;
  fieldsByWritePath: Map<string, FrontierViewField[]>;
  fieldsBySourcePrefix: Map<string, FrontierViewField[]>;
  fieldsByWritePrefix: Map<string, FrontierViewField[]>;
  fieldsByRepresentation: Map<string, FrontierViewField[]>;
  fieldsByAction: Map<string, FrontierViewField[]>;
  flowsById: Map<string, FrontierViewFlow>;
  actionsById: Map<string, FrontierViewAction>;
}

export function defineView(input: FrontierViewManifestInput): FrontierViewManifest {
  return createViewManifest(input);
}

export function createViewManifest(input: FrontierViewManifestInput): FrontierViewManifest {
  const diagnostics: FrontierViewDiagnostic[] = [];
  const id = normalizeId(input.id, 'view id');
  const source = normalizeSource(input.source);
  const representations = normalizeRepresentations(input.representations);
  const defaults = normalizeDefaults(input.defaults, representations);
  const fields = normalizeFields(input, source, defaults, representations, diagnostics);
  const flows = normalizeFlows(input.flows, id, diagnostics);
  const manifest: FrontierViewManifest = {
    kind: FRONTIER_VIEW_MANIFEST_KIND,
    version: FRONTIER_VIEW_MANIFEST_VERSION,
    id,
    name: input.name ?? id,
    description: input.description,
    source,
    defaults,
    fields,
    flows,
    representations,
    generatedAt: input.generatedAt,
    package: input.package,
    feature: input.feature,
    owner: input.owner,
    sourceLocation: input.sourceLocation,
    tags: normalizeStrings(input.tags),
    diagnostics,
    summary: emptySummary(),
    metadata: toJsonObject(input.metadata)
  };
  manifest.diagnostics = validateViewManifest(manifest);
  manifest.summary = summarizeManifest(manifest, manifest.diagnostics);
  return manifest;
}

export function validateViewManifest(manifest: FrontierViewManifest): FrontierViewDiagnostic[] {
  const diagnostics: FrontierViewDiagnostic[] = [];
  const fieldIds = new Set<string>();
  const actionIds = new Set<string>();
  const paths = new Set<string>();

  if (manifest.id.length === 0) {
    diagnostics[diagnostics.length] = diagnostic('error', 'missing-view-id', 'view manifest id is required');
  }

  for (const field of manifest.fields) {
    if (fieldIds.has(field.id)) {
      diagnostics[diagnostics.length] = diagnostic('error', 'duplicate-field-id', 'field id is declared more than once: ' + field.id, {
        fieldId: field.id,
        path: field.path
      });
    }
    fieldIds.add(field.id);
    paths.add(field.sourcePath);
    if (field.writePath) paths.add(field.writePath);
    for (const action of field.actions) {
      if (actionIds.has(action.id)) {
        diagnostics[diagnostics.length] = diagnostic('error', 'duplicate-action-id', 'action id is declared more than once: ' + action.id, {
          actionId: action.id,
          fieldId: field.id
        });
      }
      actionIds.add(action.id);
    }
  }

  for (const flow of manifest.flows) {
    for (const action of flow.actions) {
      if (actionIds.has(action.id)) {
        diagnostics[diagnostics.length] = diagnostic('error', 'duplicate-action-id', 'action id is declared more than once: ' + action.id, {
          actionId: action.id
        });
      }
      actionIds.add(action.id);
    }
    if (flow.submit) {
      if (actionIds.has(flow.submit.id)) {
        diagnostics[diagnostics.length] = diagnostic('error', 'duplicate-action-id', 'action id is declared more than once: ' + flow.submit.id, {
          actionId: flow.submit.id
        });
      }
      actionIds.add(flow.submit.id);
    }
  }

  if (paths.size === 0 && manifest.fields.length !== 0) {
    diagnostics[diagnostics.length] = diagnostic('warning', 'missing-source-paths', 'view fields do not declare source paths');
  }

  return diagnostics;
}

export function materializeView(
  input: FrontierViewManifest | FrontierViewManifestInput,
  options: FrontierViewMaterializeOptions = {}
): FrontierViewFrame {
  const manifest = isManifest(input) ? input : createViewManifest(input);
  const flow = findFlow(manifest, options.flow);
  const validation = options.validation ?? 'field';
  const capabilities = new Set((options.capabilities ?? []).map(String));
  const nodes: FrontierViewNode[] = [];
  const issues: FrontierViewIssue[] = [];
  let editableCount = 0;
  let readonlyCount = 0;
  let hiddenCount = 0;
  let hasDirtyNode = false;

  for (const field of manifest.fields) {
    const merged = mergeFieldFlowOverride(field, flow);
    const sourceValue = getPathValue(options.state, merged.sourcePath);
    const writePath = resolveWritePath(merged, manifest.source?.path, flow);
    const value = writePath ? getPathValue(options.state, writePath) ?? sourceValue : sourceValue;
    const visible = evaluateCondition(merged.visibleWhen, options.state, capabilities, true);
    const editableAllowed = evaluateCondition(merged.editableWhen, options.state, capabilities, true);
    const mode = resolveMode(merged, flow, visible, editableAllowed);
    const hidden = mode === 'hidden' || !visible;
    const disabled = mode === 'disabled';
    const readonly = hidden || disabled || mode === 'readonly' || merged.readOnly || !writePath;
    const editable = !hidden && !disabled && !readonly && mode === 'editable';
    const dirty = writePath !== undefined && !jsonEqual(value, sourceValue);
    if (dirty) hasDirtyNode = true;
    const nodeIssues = validation === 'none' ? [] : validateFieldValue(merged, value, sourceValue, dirty, capabilities, validation);
    for (const issue of nodeIssues) issues[issues.length] = issue;
    if (editable) editableCount++;
    else if (hidden) hiddenCount++;
    else readonlyCount++;
    if (hidden && options.includeHidden !== true) continue;
    const representation = resolveFieldRepresentation(manifest, merged, value);
    const actions = merged.actions.map((action) =>
      materializeAction(action, {
        manifest,
        field: merged,
        state: options.state,
        issues: nodeIssues,
        dirty,
        capabilities
      })
    );
    nodes[nodes.length] = {
      id: manifest.id + ':node:' + merged.id,
      fieldId: merged.id,
      path: merged.path,
      sourcePath: merged.sourcePath,
      writePath,
      label: merged.label,
      description: merged.description,
      type: merged.type,
      format: merged.format,
      representation,
      mode,
      editable,
      readonly,
      hidden,
      disabled,
      required: merged.required,
      value,
      sourceValue,
      dirty,
      issues: nodeIssues,
      actions,
      channels: mergeChannels(representation.channels, merged.channels),
      virtual: merged.virtual ?? flow?.virtual ?? representation.virtual,
      lod: merged.lod ?? flow?.lod ?? representation.lod,
      order: merged.order,
      tags: merged.tags.slice(),
      metadata: merged.metadata
    };
  }

  const flowActions = flow ? flow.actions.concat(flow.submit ? [flow.submit] : []) : [];
  const frameActions = flowActions.map((action) =>
    materializeAction(action, {
      manifest,
      state: options.state,
      issues,
      dirty: hasDirtyNode,
      capabilities
    })
  );
  for (const action of frameActions) {
    if (!action.ready) {
      for (const reason of action.blockedReasons) {
        issues[issues.length] = {
          path: '/',
          actionId: action.id,
          code: 'action-blocked',
          message: 'action is blocked: ' + reason,
          severity: 'warning',
          source: 'action'
        };
      }
    }
  }

  let errorCount = 0;
  let warningCount = 0;
  for (const issue of issues) {
    if (issue.severity === 'error') errorCount++;
    else if (issue.severity === 'warning') warningCount++;
  }

  const summary: FrontierViewSummary = {
    fieldCount: nodes.length,
    actionCount: frameActions.length + nodes.reduce((sum, node) => sum + node.actions.length, 0),
    representationCount: new Set(nodes.map((node) => node.representation.id)).size,
    flowCount: flow ? 1 : 0,
    sourcePathCount: new Set(nodes.map((node) => node.sourcePath)).size,
    writePathCount: new Set(nodes.map((node) => node.writePath).filter(isString)).size,
    editableCount,
    readonlyCount,
    hiddenCount,
    issueCount: issues.length,
    errorCount,
    warningCount
  };

  return {
    kind: FRONTIER_VIEW_FRAME_KIND,
    version: FRONTIER_VIEW_FRAME_VERSION,
    manifestId: manifest.id,
    flow: flow?.id,
    generatedAt: options.generatedAt,
    nodes,
    actions: frameActions,
    issues,
    summary,
    metadata: toJsonObject(options.metadata)
  };
}

export function queryViewManifest(manifest: FrontierViewManifest, query: FrontierViewQueryInput = {}): FrontierViewQueryResult {
  const index = getViewIndex(manifest);
  const pathQueries = (query.paths ?? []).map(normalizePath);
  const writePathQueries = (query.writePaths ?? []).map(normalizePath);
  const idSet = query.ids ? new Set(query.ids.map(String)) : null;
  const repSet = query.representations ? new Set(query.representations.map(String)) : null;
  const featureSet = query.features ? new Set(query.features.map(String)) : null;
  const packageSet = query.packages ? new Set(query.packages.map(String)) : null;
  const tagSet = query.tags ? new Set(query.tags.map(String)) : null;
  const actionSet = query.actions ? new Set(query.actions.map(String)) : null;
  const text = query.text?.toLowerCase();
  const limit = query.limit && query.limit > 0 ? Math.floor(query.limit) : Infinity;

  const fields: FrontierViewField[] = [];
  for (const field of candidateFieldsForQuery(manifest, index, query, pathQueries, writePathQueries)) {
    if (fields.length >= limit) break;
    if (idSet && !idSet.has(field.id)) continue;
    if (pathQueries.length !== 0 && !pathQueries.some((path) => pathsOverlap(path, field.sourcePath))) continue;
    if (writePathQueries.length !== 0 && (!field.writePath || !writePathQueries.some((path) => pathsOverlap(path, field.writePath as string)))) continue;
    const representation = resolveFieldRepresentation(manifest, field);
    if (repSet && !repSet.has(representation.kind) && !repSet.has(representation.id)) continue;
    if (featureSet && (!field.feature || !featureSet.has(field.feature))) continue;
    if (packageSet && (!field.package || !packageSet.has(field.package))) continue;
    if (tagSet && !field.tags.some((tag) => tagSet.has(tag))) continue;
    if (actionSet && !field.actions.some((action) => actionSet.has(action.id) || actionSet.has(action.action))) continue;
    if (text && !fieldMatchesText(field, representation, text)) continue;
    fields[fields.length] = cloneField(field);
  }

  const flowSet = query.flows ? new Set(query.flows.map(String)) : null;
  const flows = manifest.flows
    .filter((flow) => (flowSet ? flowSet.has(flow.id) : true))
    .map(cloneFlow);
  const actions = collectActions(manifest, fields, flows)
    .filter((action) => (actionSet ? actionSet.has(action.id) || actionSet.has(action.action) : true))
    .map(cloneAction);
  const representationIds = new Set(fields.map((field) => resolveFieldRepresentation(manifest, field).id));
  const representations = Object.values(manifest.representations)
    .filter((representation) => representationIds.has(representation.id) || (repSet ? repSet.has(representation.id) || repSet.has(representation.kind) : false))
    .map(cloneRepresentation);

  return {
    kind: FRONTIER_VIEW_QUERY_KIND,
    version: FRONTIER_VIEW_QUERY_VERSION,
    query,
    summary: summarizeQuery(fields, flows, actions, representations),
    fields,
    flows,
    actions,
    representations
  };
}

export function createViewRegistryGraph(
  manifest: FrontierViewManifest,
  input: { generatedAt?: number; metadata?: JsonObject } = {}
): FrontierRegistryGraph {
  if (input.generatedAt === undefined && input.metadata === undefined) {
    const cached = registryGraphCache.get(manifest);
    if (cached) return cached;
  }
  const entries: FrontierRegistryEntry[] = [
    {
      id: manifest.id,
      kind: 'view',
      description: manifest.description,
      package: manifest.package,
      feature: manifest.feature,
      owner: manifest.owner,
      source: manifest.sourceLocation,
      reads: manifest.source?.path ? [manifest.source.path] : [],
      tags: manifest.tags,
      metadata: manifest.metadata
    }
  ];
  const edges: FrontierRegistryEdge[] = [];

  for (const representation of Object.values(manifest.representations)) {
    entries[entries.length] = {
      id: representation.id,
      kind: 'view-representation',
      package: manifest.package,
      feature: manifest.feature,
      tags: representation.tags,
      metadata: representation.metadata
    };
  }

  for (const field of manifest.fields) {
    const representation = resolveFieldRepresentation(manifest, field);
    entries[entries.length] = {
      id: field.id,
      kind: 'view-field',
      description: field.description,
      package: field.package ?? manifest.package,
      feature: field.feature ?? manifest.feature,
      owner: field.owner ?? manifest.owner,
      source: field.source,
      reads: [field.sourcePath],
      writes: field.writePath ? [field.writePath] : [],
      calls: field.actions.map((action) => action.id),
      affects: [representation.id],
      tags: field.tags,
      metadata: field.metadata
    };
    edges[edges.length] = { from: 'entry:' + manifest.id, to: 'entry:' + field.id, kind: 'owns' };
    edges[edges.length] = { from: 'entry:' + field.id, to: 'entry:' + representation.id, kind: 'uses-representation' };
    for (const action of field.actions) entries[entries.length] = actionEntry(action, field, manifest);
  }

  for (const flow of manifest.flows) {
    entries[entries.length] = {
      id: manifest.id + ':flow:' + flow.id,
      kind: 'view-flow',
      package: manifest.package,
      feature: manifest.feature,
      tags: flow.tags,
      metadata: flow.metadata
    };
    edges[edges.length] = { from: 'entry:' + manifest.id, to: 'entry:' + manifest.id + ':flow:' + flow.id, kind: 'owns' };
    for (const action of flow.actions) entries[entries.length] = actionEntry(action, undefined, manifest);
    if (flow.submit) entries[entries.length] = actionEntry(flow.submit, undefined, manifest);
  }

  const graph = createFrontierRegistryGraph({
    entries,
    edges,
    generatedAt: input.generatedAt,
    metadata: input.metadata
  });
  if (input.generatedAt === undefined && input.metadata === undefined) registryGraphCache.set(manifest, graph);
  return graph;
}

export function traceViewImpact(manifest: FrontierViewManifest, input: FrontierViewImpactInput = {}): FrontierViewImpact {
  const index = getViewIndex(manifest);
  const query = input.query ? queryViewManifest(manifest, input.query) : undefined;
  const ids = new Set<string>(input.ids ?? []);
  for (const id of input.fields ?? []) ids.add(id);
  for (const id of input.actions ?? []) ids.add(id);
  for (const id of input.representations ?? []) ids.add(id);
  for (const field of query?.fields ?? []) ids.add(field.id);
  for (const action of query?.actions ?? []) ids.add(action.id);
  for (const representation of query?.representations ?? []) ids.add(representation.id);
  const graph = createViewRegistryGraph(manifest);
  const registry = frontierRegistryImpact(graph, {
    ...input,
    ids: Array.from(ids),
    paths: input.paths,
    direction: input.direction ?? 'forward'
  });
  const impactedEntries = registry.entries;
  const fieldIds = impactedEntries.filter((entry) => entry.kind === 'view-field').map((entry) => entry.id).sort();
  const actionIds = impactedEntries.filter((entry) => entry.kind === 'view-action').map((entry) => entry.id).sort();
  const representations = impactedEntries.filter((entry) => entry.kind === 'view-representation').map((entry) => entry.id).sort();
  const impactedFields = fieldIds.map((id) => index.fieldsById.get(id)).filter(isField);
  return {
    kind: FRONTIER_VIEW_IMPACT_KIND,
    version: FRONTIER_VIEW_IMPACT_VERSION,
    seeds: registry.seeds,
    nodes: registry.nodes,
    viewIds: impactedEntries.filter((entry) => entry.kind === 'view').map((entry) => entry.id).sort(),
    fieldIds,
    actionIds,
    representations,
    paths: uniqueSorted(impactedFields.map((field) => field.sourcePath)),
    writePaths: uniqueSorted(impactedFields.map((field) => field.writePath).filter(isString)),
    features: uniqueSorted(impactedEntries.map((entry) => entry.feature).filter(isString)),
    packages: uniqueSorted(impactedEntries.map((entry) => entry.package).filter(isString)),
    tags: uniqueSorted(impactedEntries.flatMap((entry) => entry.tags ?? [])),
    registry
  };
}

export function createViewRecord(input: FrontierViewRecordInput): FrontierRegistryRecord {
  const id = input.id ?? input.viewId + ':record:' + (input.actionId ?? input.fieldId ?? 'view');
  return {
    id,
    entryId: input.actionId ?? input.fieldId ?? input.viewId,
    kind: input.actionId ? 'view-action' : input.fieldId ? 'view-field' : 'view',
    causeId: input.causeId,
    parentId: input.parentId,
    status: input.status,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    durationMs: input.durationMs,
    input: toJsonValue(input.input),
    output: toJsonValue(input.output),
    reads: normalizePaths(input.reads),
    writes: normalizePaths(input.writes),
    affected: normalizeStrings(input.affected),
    metadata: toJsonObject(input.metadata),
    error: input.error
  };
}

export function encodeViewJsonl(
  manifest: FrontierViewManifest,
  options: { redactKeys?: readonly string[] } = {}
): string {
  if (!options.redactKeys) {
    const cached = jsonlCache.get(manifest);
    if (cached) return cached;
  }
  const encoded = {
    kind: FRONTIER_VIEW_JSONL_KIND,
    version: FRONTIER_VIEW_JSONL_VERSION,
    manifest: options.redactKeys ? redactViewManifest(manifest, { redactKeys: options.redactKeys }) : manifest
  };
  const text = stableStringify(encoded) + '\n';
  if (!options.redactKeys) jsonlCache.set(manifest, text);
  return text;
}

export function decodeViewJsonl(text: string): FrontierViewManifest {
  const line = firstJsonLine(text);
  if (!line) throw new TypeError('frontier view JSONL is empty');
  const decoded = JSON.parse(line) as { manifest?: FrontierViewManifestInput | FrontierViewManifest };
  if (!decoded.manifest) throw new TypeError('frontier view JSONL is missing manifest');
  return isManifest(decoded.manifest) ? cloneManifest(decoded.manifest) : createViewManifest(decoded.manifest);
}

export function redactViewManifest(
  manifest: FrontierViewManifest,
  options: { redactKeys?: readonly string[] } = {}
): FrontierViewManifest {
  const keyList = (options.redactKeys ?? ['authorization', 'cookie', 'password', 'secret', 'token']).map((key) => key.toLowerCase()).sort();
  const cacheKey = keyList.join('\0');
  const cached = redactedManifestCache.get(manifest)?.get(cacheKey);
  if (cached) return cloneManifest(cached);

  const redacted = redactUnknown(manifest, new Set(keyList)) as FrontierViewManifest;
  let cache = redactedManifestCache.get(manifest);
  if (!cache) {
    cache = new Map();
    redactedManifestCache.set(manifest, cache);
  }
  cache.set(cacheKey, redacted);
  return cloneManifest(redacted);
}

export function createViewProof(manifest: FrontierViewManifest, generatedAt = Date.now()): FrontierViewProof {
  let hash = proofHashCache.get(manifest);
  if (!hash) {
    const stable = stableStringify({
      id: manifest.id,
      fields: manifest.fields,
      flows: manifest.flows,
      representations: manifest.representations,
      defaults: manifest.defaults
    });
    hash = fnv1a(stable);
    proofHashCache.set(manifest, hash);
  }
  return {
    kind: FRONTIER_VIEW_PROOF_KIND,
    version: FRONTIER_VIEW_PROOF_VERSION,
    generatedAt,
    manifestId: manifest.id,
    hash,
    summary: manifest.summary
  };
}

function firstJsonLine(text: string): string | undefined {
  let start = 0;
  for (let index = 0; index <= text.length; index++) {
    const char = index === text.length ? 10 : text.charCodeAt(index);
    if (char !== 10 && char !== 13) continue;
    const line = text.slice(start, index).trim();
    if (line.length !== 0) return line;
    start = char === 13 && text.charCodeAt(index + 1) === 10 ? index + 2 : index + 1;
    if (start !== index + 1) index++;
  }
  return undefined;
}

function normalizeSource(input?: FrontierViewSourceInput): FrontierViewSource | undefined {
  if (!input) return undefined;
  return {
    path: input.path === undefined ? undefined : normalizePath(input.path),
    schema: input.schema ? cloneSchema(input.schema) : undefined,
    query: toJsonValue(input.query),
    entity: toJsonValue(input.entity),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeRepresentations(
  input?: FrontierViewManifestInput['representations']
): Record<string, FrontierViewRepresentation> {
  const representations: Record<string, FrontierViewRepresentation> = {};
  for (const [key, kind] of Object.entries(DEFAULT_REPRESENTATIONS)) {
    const representation = normalizeRepresentation(kind, key);
    representations[representation.id] = representation;
  }
  if (!input) return representations;
  const entries = Array.isArray(input)
    ? input.map((value, index) => [String(value.id ?? 'representation.' + index), value] as const)
    : Object.entries(input);
  for (const [key, value] of entries) {
    const representation = normalizeRepresentation(value, key, true);
    representations[representation.id] = representation;
  }
  return representations;
}

function normalizeRepresentation(
  input: string | FrontierViewRepresentationInput | undefined,
  fallback: string,
  preferFallbackId = false
): FrontierViewRepresentation {
  if (typeof input === 'string' || input === undefined) {
    const kind = input ?? fallback;
    return {
      id: preferFallbackId ? fallback : kind,
      kind,
      target: 'any',
      channels: {},
      variants: {},
      tags: []
    };
  }
  const kind = input.kind ?? input.id ?? fallback;
  return {
    id: input.id ?? (preferFallbackId ? fallback : kind),
    kind,
    target: input.target ?? 'any',
    channels: normalizeChannels(input.channels),
    variants: normalizeStringRecord(input.variants),
    material: toJsonValue(input.material),
    shader: toJsonValue(input.shader),
    attributes: toJsonValue(input.attributes),
    virtual: normalizeVirtual(input.virtual),
    lod: normalizeLod(input.lod),
    tags: normalizeStrings(input.tags),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeDefaults(
  input: FrontierViewDefaultsInput | undefined,
  representations: Record<string, FrontierViewRepresentation>
): Record<string, FrontierViewDefault> {
  const defaults: Record<string, FrontierViewDefault> = {};
  for (const [key, representationKind] of Object.entries(DEFAULT_REPRESENTATIONS)) {
    const representation = representations[representationKind] ?? normalizeRepresentation(representationKind, key);
    defaults[key] = { key, representation, validate: [] };
  }
  if (!input) return defaults;
  const entries = Array.isArray(input)
    ? input.map((value, index) => ['default.' + index, value] as const)
    : Object.entries(input);
  for (const [key, value] of entries) {
    const defaultInput: FrontierViewDefaultInput = typeof value === 'string' ? { representation: value } : value;
    const representation = normalizeDefaultRepresentation(defaultInput.representation, key, representations);
    defaults[key] = {
      key,
      representation,
      mode: defaultInput.mode,
      validate: normalizeValidationSteps(defaultInput.validate, key),
      metadata: toJsonObject(defaultInput.metadata)
    };
  }
  return defaults;
}

function normalizeDefaultRepresentation(
  input: string | FrontierViewRepresentationInput | undefined,
  key: string,
  representations: Record<string, FrontierViewRepresentation>
): FrontierViewRepresentation {
  if (typeof input === 'string') return representations[input] ?? normalizeRepresentation(input, key);
  if (input) return normalizeRepresentation(input, key);
  return representations[key] ?? representations[DEFAULT_REPRESENTATIONS[key]] ?? normalizeRepresentation(DEFAULT_REPRESENTATIONS.unknown, key);
}

function normalizeFields(
  input: FrontierViewManifestInput,
  source: FrontierViewSource | undefined,
  defaults: Record<string, FrontierViewDefault>,
  representations: Record<string, FrontierViewRepresentation>,
  diagnostics: FrontierViewDiagnostic[]
): FrontierViewField[] {
  const byPath = new Map<string, FrontierViewFieldInput>();
  if (source?.schema) {
    for (const inferred of inferSchemaFields(source.schema, source.path ?? '')) byPath.set(normalizePath(inferred.path ?? ''), inferred);
  }
  const explicit = input.fields;
  if (explicit) {
    const entries = Array.isArray(explicit)
      ? explicit.map((field) => [normalizePath(field.path ?? field.sourcePath ?? field.id ?? ''), field] as const)
      : Object.entries(explicit).map(([path, field]) => [normalizePath(field.path ?? field.sourcePath ?? path), { ...field, path: field.path ?? path }] as const);
    for (const [path, field] of entries) byPath.set(path, { ...(byPath.get(path) ?? {}), ...field, path: field.path ?? path });
  }

  const fields: FrontierViewField[] = [];
  let order = 0;
  for (const [path, field] of Array.from(byPath.entries()).sort((left, right) => compareNumber(left[1].order, right[1].order) || left[0].localeCompare(right[0]))) {
    try {
      fields[fields.length] = normalizeField(field, path, input.id, source, defaults, representations, order++);
    } catch (error) {
      diagnostics[diagnostics.length] = diagnostic('error', 'invalid-field', String((error as Error).message), { path });
    }
  }
  return fields.sort((left, right) => left.order - right.order || left.path.localeCompare(right.path));
}

function inferSchemaFields(schema: FrontierViewSchemaLike, sourcePath: string, parentRequired: readonly string[] = []): FrontierViewFieldInput[] {
  const fields: FrontierViewFieldInput[] = [];
  const schemaType = schemaTypeOf(schema);
  if (schemaType === 'object' && schema.properties) {
    const required = new Set(schema.required ?? parentRequired);
    for (const [key, child] of Object.entries(schema.properties)) {
      const path = joinPath(sourcePath, key);
      fields[fields.length] = {
        path,
        schemaPath: '#/properties/' + escapePointerToken(key),
        label: child.title ?? titleFromPath(key),
        description: child.description,
        type: schemaTypeOf(child),
        format: child.format,
        enum: child.enum,
        required: required.has(key),
        readOnly: child.readOnly,
        writeOnly: child.writeOnly,
        validate: schemaValidationSteps(child, path, required.has(key))
      };
      if (schemaTypeOf(child) === 'object' && child.properties) {
        fields.push(...inferSchemaFields(child, path, child.required ?? []));
      } else if (schemaTypeOf(child) === 'array') {
        fields[fields.length - 1] = { ...fields[fields.length - 1], representation: 'collection.list' };
      }
    }
  } else {
    fields[fields.length] = {
      path: sourcePath,
      label: titleFromPath(sourcePath || 'value'),
      description: schema.description,
      type: schemaType,
      format: schema.format,
      enum: schema.enum,
      required: false,
      readOnly: schema.readOnly,
      writeOnly: schema.writeOnly,
      validate: schemaValidationSteps(schema, sourcePath, false)
    };
  }
  return fields;
}

function schemaValidationSteps(schema: FrontierViewSchemaLike, path: string, required: boolean): FrontierViewValidationStepLike[] {
  const steps: FrontierViewValidationStepLike[] = [];
  if (required) steps[steps.length] = 'required';
  if (schema.format === 'email') steps[steps.length] = 'email';
  if (schema.type !== undefined) steps[steps.length] = { code: 'type', path };
  if (schema.enum !== undefined) steps[steps.length] = { code: 'enum', path };
  if (schema.minimum !== undefined || schema.maximum !== undefined || schema.multipleOf !== undefined) {
    steps[steps.length] = {
      code: 'range',
      path,
      metadata: {
        minimum: schema.minimum,
        maximum: schema.maximum,
        multipleOf: schema.multipleOf
      }
    };
  }
  if (schema.minLength !== undefined || schema.maxLength !== undefined || schema.minItems !== undefined || schema.maxItems !== undefined) {
    steps[steps.length] = {
      code: 'length',
      path,
      metadata: {
        minLength: schema.minLength,
        maxLength: schema.maxLength,
        minItems: schema.minItems,
        maxItems: schema.maxItems
      }
    };
  }
  if (schema.pattern !== undefined) steps[steps.length] = { code: 'pattern', path, metadata: { pattern: schema.pattern } };
  return steps;
}

function normalizeField(
  input: FrontierViewFieldInput,
  path: string,
  viewId: string,
  source: FrontierViewSource | undefined,
  defaults: Record<string, FrontierViewDefault>,
  representations: Record<string, FrontierViewRepresentation>,
  order: number
): FrontierViewField {
  const sourcePath = normalizePath(input.sourcePath ?? input.path ?? path);
  const type = input.type ?? inferTypeFromSchemaPath(source?.schema, source?.path, sourcePath) ?? 'unknown';
  const format = input.format ?? inferFormatFromSchemaPath(source?.schema, source?.path, sourcePath);
  const enumValues = cloneJsonArray(input.enum ?? inferEnumFromSchemaPath(source?.schema, source?.path, sourcePath) ?? []);
  const defaultKey = enumValues.length !== 0 ? 'enum' : format && defaults[format] ? format : type;
  const defaultRule = defaults[defaultKey] ?? defaults.unknown;
  const representation = input.representation
    ? normalizeDefaultRepresentation(input.representation, sourcePath, representations)
    : defaultRule?.representation;
  return {
    id: input.id ?? viewId + ':field:' + sourcePath,
    path: normalizePath(input.path ?? sourcePath),
    sourcePath,
    writePath: input.writePath === undefined ? undefined : normalizePath(input.writePath),
    schemaPath: input.schemaPath === undefined ? undefined : normalizePath(input.schemaPath),
    label: input.label ?? titleFromPath(sourcePath),
    description: input.description,
    type,
    format,
    enum: enumValues,
    required: input.required ?? false,
    readOnly: input.readOnly ?? false,
    writeOnly: input.writeOnly ?? false,
    mode: input.mode ?? defaultRule?.mode,
    representation,
    channels: normalizeChannels(input.channels),
    visibleWhen: input.visibleWhen,
    editableWhen: input.editableWhen,
    validate: normalizeValidationSteps(input.validate ?? defaultRule?.validate, sourcePath),
    actions: normalizeActions(input.actions, input.id ?? sourcePath),
    virtual: normalizeVirtual(input.virtual),
    lod: normalizeLod(input.lod),
    order: input.order ?? order,
    feature: input.feature,
    package: input.package,
    owner: input.owner,
    source: input.source,
    tags: normalizeStrings(input.tags),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeFlows(
  input: FrontierViewManifestInput['flows'],
  viewId: string,
  diagnostics: FrontierViewDiagnostic[]
): FrontierViewFlow[] {
  if (!input) return [];
  const entries = Array.isArray(input)
    ? input.map((flow, index) => [flow.id ?? 'flow.' + index, flow] as const)
    : Object.entries(input);
  const flows: FrontierViewFlow[] = [];
  for (const [id, flow] of entries) {
    try {
      const normalizedId = normalizeId(flow.id ?? id, 'view flow id');
      const fieldOverrides: Record<string, FrontierViewFieldInput> = {};
      for (const [path, field] of Object.entries((flow.fields ?? {}) as Record<string, FrontierViewFieldInput>)) {
        fieldOverrides[normalizePath(field.path ?? field.sourcePath ?? path)] = field;
      }
      flows[flows.length] = {
        id: normalizedId,
        label: flow.label,
        mode: flow.mode,
        draftFrom: flow.draftFrom === undefined ? undefined : normalizePath(flow.draftFrom),
        draftPath: flow.draftPath === undefined ? undefined : normalizePath(flow.draftPath),
        validate: normalizeValidationSteps(flow.validate, normalizedId),
        fieldOverrides,
        actions: normalizeActions(flow.actions, viewId + ':flow:' + normalizedId),
        submit: flow.submit ? normalizeAction(flow.submit, viewId + ':flow:' + normalizedId + ':submit') : undefined,
        virtual: normalizeVirtual(flow.virtual),
        lod: normalizeLod(flow.lod),
        tags: normalizeStrings(flow.tags),
        metadata: toJsonObject(flow.metadata)
      };
    } catch (error) {
      diagnostics[diagnostics.length] = diagnostic('error', 'invalid-flow', String((error as Error).message));
    }
  }
  return flows;
}

function normalizeValidationSteps(input: readonly FrontierViewValidationStepLike[] | undefined, owner: string): FrontierViewValidationStep[] {
  const steps = input ?? [];
  return steps.map((step, index) => {
    const raw = typeof step === 'string' ? { code: step } : step;
    return {
      id: raw.id ?? owner + ':validation:' + (raw.code ?? raw.kind ?? index),
      kind: raw.kind ?? raw.code ?? 'field',
      code: raw.code ?? raw.kind ?? 'custom',
      path: raw.path === undefined ? undefined : normalizePath(raw.path),
      message: raw.message,
      severity: raw.severity ?? 'error',
      requires: raw.requires,
      metadata: toJsonObject(raw.metadata)
    };
  });
}

function normalizeActions(input: Record<string, FrontierViewActionInput> | readonly FrontierViewActionInput[] | undefined, owner: string): FrontierViewAction[] {
  if (!input) return [];
  const entries = Array.isArray(input)
    ? input.map((action, index) => [action.id ?? 'action.' + index, action] as const)
    : Object.entries(input);
  return entries.map(([id, action]) => normalizeAction({ ...action, id: action.id ?? id }, owner));
}

function normalizeAction(input: FrontierViewActionInput, owner: string): FrontierViewAction {
  const id = normalizeId(input.id ?? input.action ?? owner + ':action', 'view action id');
  return {
    id,
    action: input.action ?? id,
    label: input.label,
    event: input.event,
    mode: input.mode ?? 'editable',
    input: toJsonValue(input.input),
    requiresValid: input.requiresValid ?? false,
    requiresDirty: input.requiresDirty ?? false,
    capabilities: normalizeStrings(input.capabilities),
    reads: normalizePaths(input.reads),
    writes: normalizePaths(input.writes),
    calls: normalizeStrings(input.calls),
    effects: normalizeStrings(input.effects),
    triggers: normalizeStrings(input.triggers),
    invalidates: normalizeStrings(input.invalidates),
    affects: normalizeStrings(input.affects),
    tags: normalizeStrings(input.tags),
    source: input.source,
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeChannels(input?: Record<string, FrontierViewChannelInput>): Record<string, FrontierViewChannel> {
  const channels: Record<string, FrontierViewChannel> = {};
  for (const [key, channel] of Object.entries(input ?? {})) {
    channels[key] = {
      from: channel.from === undefined ? undefined : normalizePath(channel.from),
      value: toJsonValue(channel.value),
      scale: channel.scale,
      domain: cloneJsonArray(channel.domain ?? []),
      range: cloneJsonArray(channel.range ?? []),
      sort: channel.sort,
      aggregate: channel.aggregate,
      axis: toJsonObject(channel.axis),
      legend: toJsonObject(channel.legend),
      transform: toJsonValue(channel.transform),
      updateTriggers: normalizeStrings(channel.updateTriggers),
      metadata: toJsonObject(channel.metadata)
    };
  }
  return channels;
}

function normalizeVirtual(input?: FrontierViewVirtualHintInput): FrontierViewVirtualHint | undefined {
  if (!input) return undefined;
  return {
    keyBy: input.keyBy,
    count: finiteNumber(input.count),
    itemSize: finiteNumber(input.itemSize),
    estimatedSize: finiteNumber(input.estimatedSize),
    overscan: finiteNumber(input.overscan),
    lanes: finiteNumber(input.lanes),
    gap: finiteNumber(input.gap),
    paddingStart: finiteNumber(input.paddingStart),
    paddingEnd: finiteNumber(input.paddingEnd),
    scrollPaddingStart: finiteNumber(input.scrollPaddingStart),
    scrollPaddingEnd: finiteNumber(input.scrollPaddingEnd),
    scrollMargin: finiteNumber(input.scrollMargin),
    initialOffset: finiteNumber(input.initialOffset),
    horizontal: input.horizontal,
    enabled: input.enabled,
    measureKey: input.measureKey,
    rangeExtractor: input.rangeExtractor,
    sticky: normalizeStrings(input.sticky),
    viewport: toJsonValue(input.viewport),
    axis: input.axis,
    rangePath: input.rangePath === undefined ? undefined : normalizePath(input.rangePath),
    anchorPath: input.anchorPath === undefined ? undefined : normalizePath(input.anchorPath),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizeLod(input?: FrontierViewLodHintInput): FrontierViewLodHint | undefined {
  if (!input) return undefined;
  return {
    profile: input.profile,
    level: input.level,
    levels: normalizeStrings(input.levels),
    significance: input.significance === undefined ? undefined : normalizePath(input.significance),
    observer: input.observer === undefined ? undefined : normalizePath(input.observer),
    budget: toJsonValue(input.budget),
    priority: finiteNumber(input.priority),
    cost: finiteNumber(input.cost),
    minZoom: finiteNumber(input.minZoom),
    maxZoom: finiteNumber(input.maxZoom),
    hysteresis: finiteNumber(input.hysteresis),
    degrade: input.degrade,
    variants: normalizeStringRecord(input.variants),
    metadata: toJsonObject(input.metadata)
  };
}

function normalizePath(path: FrontierRegistryPath): string {
  return normalizeFrontierRegistryPath(path);
}

function normalizePaths(paths: readonly FrontierRegistryPath[] | undefined): string[] {
  return (paths ?? []).map(normalizePath);
}

function normalizeStrings(values: readonly unknown[] | undefined): string[] {
  return (values ?? []).map(String).filter((value) => value.length !== 0);
}

function normalizeStringRecord(input: Record<string, string> | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input ?? {})) out[key] = String(value);
  return out;
}

function normalizeId(value: string, label: string): string {
  const id = String(value).trim();
  if (!id) throw new TypeError(label + ' is required');
  return id;
}

function getViewIndex(manifest: FrontierViewManifest): FrontierViewIndex {
  const cached = viewIndexCache.get(manifest);
  if (cached) return cached;

  const index: FrontierViewIndex = {
    fieldsById: new Map(),
    fieldsBySourcePath: new Map(),
    fieldsByWritePath: new Map(),
    fieldsBySourcePrefix: new Map(),
    fieldsByWritePrefix: new Map(),
    fieldsByRepresentation: new Map(),
    fieldsByAction: new Map(),
    flowsById: new Map(),
    actionsById: new Map()
  };

  for (const flow of manifest.flows) {
    index.flowsById.set(flow.id, flow);
    for (const action of flow.actions) index.actionsById.set(action.id, action);
    if (flow.submit) index.actionsById.set(flow.submit.id, flow.submit);
  }

  for (const field of manifest.fields) {
    index.fieldsById.set(field.id, field);
    addMappedValue(index.fieldsBySourcePath, field.sourcePath, field);
    addPathPrefixes(index.fieldsBySourcePrefix, field.sourcePath, field);
    if (field.writePath) {
      addMappedValue(index.fieldsByWritePath, field.writePath, field);
      addPathPrefixes(index.fieldsByWritePrefix, field.writePath, field);
    }
    const representation = resolveFieldRepresentation(manifest, field);
    addMappedValue(index.fieldsByRepresentation, representation.id, field);
    addMappedValue(index.fieldsByRepresentation, representation.kind, field);
    for (const action of field.actions) {
      index.actionsById.set(action.id, action);
      addMappedValue(index.fieldsByAction, action.id, field);
      addMappedValue(index.fieldsByAction, action.action, field);
    }
  }

  viewIndexCache.set(manifest, index);
  return index;
}

function candidateFieldsForQuery(
  manifest: FrontierViewManifest,
  index: FrontierViewIndex,
  query: FrontierViewQueryInput,
  pathQueries: readonly string[],
  writePathQueries: readonly string[]
): readonly FrontierViewField[] {
  const candidateSets: FrontierViewField[][] = [];

  if (query.ids?.length) {
    candidateSets[candidateSets.length] = query.ids
      .map((id) => index.fieldsById.get(String(id)))
      .filter(isField);
  }
  if (pathQueries.length) candidateSets[candidateSets.length] = unionFieldLists(pathQueries.map((path) => fieldsOverlappingPath(index.fieldsBySourcePath, index.fieldsBySourcePrefix, path)));
  if (writePathQueries.length) candidateSets[candidateSets.length] = unionFieldLists(writePathQueries.map((path) => fieldsOverlappingPath(index.fieldsByWritePath, index.fieldsByWritePrefix, path)));
  if (query.representations?.length) candidateSets[candidateSets.length] = unionFieldLists(query.representations.map((id) => index.fieldsByRepresentation.get(String(id)) ?? []));
  if (query.actions?.length) candidateSets[candidateSets.length] = unionFieldLists(query.actions.map((id) => index.fieldsByAction.get(String(id)) ?? []));

  if (candidateSets.length === 0) return manifest.fields;
  let best = candidateSets[0] ?? [];
  for (let i = 1; i < candidateSets.length; i++) {
    const next = candidateSets[i] ?? [];
    if (next.length < best.length) best = next;
  }
  return best;
}

function fieldsOverlappingPath(
  exact: Map<string, FrontierViewField[]>,
  prefixes: Map<string, FrontierViewField[]>,
  path: string
): FrontierViewField[] {
  const fields = new Set<FrontierViewField>(prefixes.get(path) ?? []);
  for (const prefix of pathPrefixes(path)) {
    for (const field of exact.get(prefix) ?? []) fields.add(field);
  }
  return Array.from(fields);
}

function addPathPrefixes(map: Map<string, FrontierViewField[]>, path: string, field: FrontierViewField): void {
  for (const prefix of pathPrefixes(path)) addMappedValue(map, prefix, field);
}

function pathPrefixes(path: string): string[] {
  const parts = pathToArray(path);
  const prefixes = ['/'];
  for (let i = 1; i <= parts.length; i++) prefixes[prefixes.length] = normalizePath(parts.slice(0, i));
  return prefixes;
}

function unionFieldLists(lists: readonly (readonly FrontierViewField[])[]): FrontierViewField[] {
  const fields = new Set<FrontierViewField>();
  for (const list of lists) for (const field of list) fields.add(field);
  return Array.from(fields);
}

function addMappedValue<T>(map: Map<string, T[]>, key: string, value: T): void {
  const values = map.get(key);
  if (values) {
    if (!values.includes(value)) values[values.length] = value;
  } else {
    map.set(key, [value]);
  }
}

function findFlow(manifest: FrontierViewManifest, id: string | undefined): FrontierViewFlow | undefined {
  if (id) return getViewIndex(manifest).flowsById.get(id);
  return manifest.flows[0];
}

function mergeFieldFlowOverride(field: FrontierViewField, flow: FrontierViewFlow | undefined): FrontierViewField {
  const override = flow?.fieldOverrides[field.path] ?? flow?.fieldOverrides[field.sourcePath] ?? flow?.fieldOverrides[field.id];
  if (!override) return field;
  return {
    ...field,
    ...normalizeField(override, field.path, field.id.split(':field:')[0] ?? field.id, undefined, {}, {}, field.order),
    id: field.id,
    path: field.path,
    sourcePath: override.sourcePath === undefined ? field.sourcePath : normalizePath(override.sourcePath),
    writePath: override.writePath === undefined ? field.writePath : normalizePath(override.writePath),
    representation: override.representation ? normalizeRepresentation(override.representation, field.representation?.id ?? field.type) : field.representation,
    validate: override.validate ? normalizeValidationSteps(override.validate, field.id) : field.validate,
    actions: override.actions ? normalizeActions(override.actions, field.id) : field.actions,
    channels: override.channels ? normalizeChannels(override.channels) : field.channels,
    virtual: override.virtual ? normalizeVirtual(override.virtual) : field.virtual,
    lod: override.lod ? normalizeLod(override.lod) : field.lod,
    tags: override.tags ? normalizeStrings(override.tags) : field.tags,
    metadata: override.metadata ? toJsonObject(override.metadata) : field.metadata
  };
}

function resolveWritePath(field: FrontierViewField, sourceRoot: string | undefined, flow: FrontierViewFlow | undefined): string | undefined {
  if (field.writePath) return field.writePath;
  if (field.readOnly || field.writeOnly || field.mode === 'readonly' || field.mode === 'hidden') return undefined;
  if (flow?.draftPath) {
    const fromRoot = flow.draftFrom ?? sourceRoot;
    return rebasePath(field.sourcePath, fromRoot, flow.draftPath);
  }
  return field.sourcePath;
}

function resolveMode(
  field: FrontierViewField,
  flow: FrontierViewFlow | undefined,
  visible: boolean,
  editableAllowed: boolean
): FrontierViewMode {
  if (!visible) return 'hidden';
  if (field.mode === 'hidden' || flow?.mode === 'hidden') return 'hidden';
  if (field.mode === 'disabled' || flow?.mode === 'disabled') return 'disabled';
  if (!editableAllowed) return 'disabled';
  if (field.readOnly || field.mode === 'readonly' || flow?.mode === 'readonly') return 'readonly';
  return 'editable';
}

function resolveFieldRepresentation(
  manifest: FrontierViewManifest,
  field: FrontierViewField,
  value?: JsonValue
): FrontierViewRepresentation {
  if (field.representation) return field.representation;
  const valueType = value === undefined ? field.type : typeOfJson(value);
  const key = field.enum.length !== 0 ? 'enum' : field.format && manifest.defaults[field.format] ? field.format : valueType;
  return manifest.defaults[key]?.representation ?? manifest.defaults[field.type]?.representation ?? manifest.defaults.unknown.representation;
}

function validateFieldValue(
  field: FrontierViewField,
  value: JsonValue | undefined,
  sourceValue: JsonValue | undefined,
  dirty: boolean,
  capabilities: Set<string>,
  validation: FrontierViewValidationStrategy
): FrontierViewIssue[] {
  const issues: FrontierViewIssue[] = [];
  const steps = field.validate.length === 0 && validation === 'all'
    ? normalizeValidationSteps(['required', 'type', 'enum'], field.id)
    : field.validate;
  for (const step of steps) {
    if (!evaluateCondition(step.requires, value, capabilities, true)) continue;
    const code = step.code;
    const path = step.path ?? field.sourcePath;
    const issue = issueForValidation(code, field, value, sourceValue, dirty, capabilities, step);
    if (issue) issues[issues.length] = { ...issue, path, fieldId: field.id };
  }
  return issues;
}

function issueForValidation(
  code: string,
  field: FrontierViewField,
  value: JsonValue | undefined,
  sourceValue: JsonValue | undefined,
  dirty: boolean,
  capabilities: Set<string>,
  step: FrontierViewValidationStep
): FrontierViewIssue | undefined {
  if (code === 'required' && (value === undefined || value === null || value === '')) {
    return validationIssue(field, step, 'required', field.label + ' is required');
  }
  if (code === 'type' && value !== undefined && value !== null && !valueMatchesType(value, field.type)) {
    return validationIssue(field, step, 'type', field.label + ' must be ' + field.type);
  }
  if (code === 'enum' && field.enum.length !== 0 && value !== undefined && !field.enum.some((candidate) => jsonEqual(candidate, value))) {
    return validationIssue(field, step, 'enum', field.label + ' must be one of the allowed values');
  }
  if (code === 'email' && typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return validationIssue(field, step, 'format.email', field.label + ' must be a valid email address');
  }
  if (code === 'range' && typeof value === 'number') {
    const minimum = metadataNumber(step.metadata, 'minimum');
    const maximum = metadataNumber(step.metadata, 'maximum');
    const multipleOf = metadataNumber(step.metadata, 'multipleOf');
    if (minimum !== undefined && value < minimum) return validationIssue(field, step, 'range.minimum', field.label + ' must be at least ' + minimum);
    if (maximum !== undefined && value > maximum) return validationIssue(field, step, 'range.maximum', field.label + ' must be at most ' + maximum);
    if (multipleOf !== undefined && multipleOf !== 0 && value / multipleOf % 1 !== 0) {
      return validationIssue(field, step, 'range.multipleOf', field.label + ' must be a multiple of ' + multipleOf);
    }
  }
  if (code === 'length' && (typeof value === 'string' || Array.isArray(value))) {
    const length = value.length;
    const min = metadataNumber(step.metadata, typeof value === 'string' ? 'minLength' : 'minItems');
    const max = metadataNumber(step.metadata, typeof value === 'string' ? 'maxLength' : 'maxItems');
    if (min !== undefined && length < min) return validationIssue(field, step, 'length.minimum', field.label + ' is too short');
    if (max !== undefined && length > max) return validationIssue(field, step, 'length.maximum', field.label + ' is too long');
  }
  if (code === 'pattern' && typeof value === 'string' && typeof step.metadata?.pattern === 'string') {
    const pattern = compiledPattern(step.metadata.pattern);
    if (!pattern) {
      return validationIssue(field, step, 'pattern.invalid', field.label + ' has an invalid pattern validator');
    }
    if (!pattern.test(value)) return validationIssue(field, step, 'pattern', field.label + ' does not match the required pattern');
  }
  if (code === 'dirty' && !dirty && jsonEqual(value, sourceValue)) {
    return validationIssue(field, step, 'dirty', field.label + ' has no changes');
  }
  if (code.startsWith('capability:') && !capabilities.has(code.slice('capability:'.length))) {
    return validationIssue(field, step, 'capability', field.label + ' requires capability ' + code.slice('capability:'.length));
  }
  return undefined;
}

function validationIssue(
  field: FrontierViewField,
  step: FrontierViewValidationStep,
  code: string,
  message: string
): FrontierViewIssue {
  return {
    path: step.path ?? field.sourcePath,
    fieldId: field.id,
    code,
    message: step.message ?? message,
    severity: step.severity,
    source: step.kind,
    metadata: step.metadata
  };
}

function metadataNumber(metadata: JsonObject | undefined, key: string): number | undefined {
  const value = metadata?.[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function compiledPattern(pattern: string): RegExp | null {
  if (patternCache.has(pattern)) return patternCache.get(pattern) ?? null;
  let compiled: RegExp | null = null;
  try {
    compiled = new RegExp(pattern);
  } catch {
    compiled = null;
  }
  if (patternCache.size >= PATTERN_CACHE_LIMIT) patternCache.clear();
  patternCache.set(pattern, compiled);
  return compiled;
}

function materializeAction(
  action: FrontierViewAction,
  context: {
    manifest: FrontierViewManifest;
    field?: FrontierViewField;
    state?: JsonValue;
    issues: readonly FrontierViewIssue[];
    dirty: boolean;
    capabilities: Set<string>;
  }
): FrontierViewActionFrame {
  const blockedReasons: string[] = [];
  if (action.requiresValid && context.issues.some((issue) => issue.severity === 'error')) blockedReasons[blockedReasons.length] = 'invalid';
  if (action.requiresDirty && !context.dirty) blockedReasons[blockedReasons.length] = 'not-dirty';
  for (const capability of action.capabilities) {
    if (!context.capabilities.has(capability)) blockedReasons[blockedReasons.length] = 'missing-capability:' + capability;
  }
  const ready = blockedReasons.length === 0;
  return {
    id: action.id,
    action: action.action,
    event: action.event,
    label: action.label,
    status: ready ? 'ready' : 'blocked',
    ready,
    blockedReasons,
    input: mapActionInput(action.input, context.state),
    reads: action.reads,
    writes: action.writes,
    effects: action.effects,
    triggers: action.triggers,
    tags: action.tags,
    metadata: action.metadata
  };
}

function mapActionInput(input: JsonValue | undefined, state: JsonValue | undefined): JsonValue | undefined {
  if (input === undefined) return undefined;
  if (Array.isArray(input)) return input.map((value) => mapActionInput(value, state) ?? null);
  if (input && typeof input === 'object') {
    const object = input as JsonObject;
    if (typeof object.from === 'string' || Array.isArray(object.from)) return getPathValue(state, object.from as FrontierRegistryPath);
    if (Object.prototype.hasOwnProperty.call(object, 'value')) return object.value;
    const mapped: JsonObject = {};
    for (const [key, value] of Object.entries(object)) {
      const next = mapActionInput(value, state);
      if (next !== undefined) mapped[key] = next;
    }
    return mapped;
  }
  return input;
}

function actionEntry(action: FrontierViewAction, field: FrontierViewField | undefined, manifest: FrontierViewManifest): FrontierRegistryEntry {
  return {
    id: action.id,
    kind: 'view-action',
    package: field?.package ?? manifest.package,
    feature: field?.feature ?? manifest.feature,
    source: action.source,
    reads: action.reads,
    writes: action.writes,
    calls: [action.action, ...action.calls],
    touches: action.effects,
    invalidates: action.invalidates,
    affects: action.affects,
    emits: action.triggers,
    tags: action.tags,
    metadata: action.metadata
  };
}

function collectActions(manifest: FrontierViewManifest, fields: FrontierViewField[], flows: FrontierViewFlow[]): FrontierViewAction[] {
  return fields.flatMap((field) => field.actions).concat(flows.flatMap((flow) => flow.actions.concat(flow.submit ? [flow.submit] : [])));
}

function summarizeManifest(manifest: FrontierViewManifest, diagnostics: readonly FrontierViewDiagnostic[]): FrontierViewSummary {
  const sourcePaths = new Set<string>();
  const writePaths = new Set<string>();
  let actionCount = 0;
  let editableCount = 0;
  let readonlyCount = 0;
  let hiddenCount = 0;
  let errorCount = 0;
  let warningCount = 0;

  for (const field of manifest.fields) {
    sourcePaths.add(field.sourcePath);
    if (field.writePath) writePaths.add(field.writePath);
    actionCount += field.actions.length;
    if (!field.readOnly && field.mode !== 'readonly' && field.mode !== 'hidden') editableCount++;
    if (field.readOnly || field.mode === 'readonly') readonlyCount++;
    if (field.mode === 'hidden') hiddenCount++;
  }
  for (const flow of manifest.flows) actionCount += flow.actions.length + (flow.submit ? 1 : 0);
  for (const issue of diagnostics) {
    if (issue.severity === 'error') errorCount++;
    else if (issue.severity === 'warning') warningCount++;
  }

  return {
    fieldCount: manifest.fields.length,
    actionCount,
    representationCount: Object.keys(manifest.representations).length,
    flowCount: manifest.flows.length,
    sourcePathCount: sourcePaths.size,
    writePathCount: writePaths.size,
    editableCount,
    readonlyCount,
    hiddenCount,
    issueCount: diagnostics.length,
    errorCount,
    warningCount
  };
}

function summarizeQuery(
  fields: readonly FrontierViewField[],
  flows: readonly FrontierViewFlow[],
  actions: readonly FrontierViewAction[],
  representations: readonly FrontierViewRepresentation[]
): FrontierViewSummary {
  const sourcePaths = new Set<string>();
  const writePaths = new Set<string>();
  let editableCount = 0;
  let readonlyCount = 0;
  let hiddenCount = 0;
  for (const field of fields) {
    sourcePaths.add(field.sourcePath);
    if (field.writePath) writePaths.add(field.writePath);
    if (!field.readOnly && field.mode !== 'readonly' && field.mode !== 'hidden') editableCount++;
    if (field.readOnly || field.mode === 'readonly') readonlyCount++;
    if (field.mode === 'hidden') hiddenCount++;
  }

  return {
    fieldCount: fields.length,
    actionCount: actions.length,
    representationCount: representations.length,
    flowCount: flows.length,
    sourcePathCount: sourcePaths.size,
    writePathCount: writePaths.size,
    editableCount,
    readonlyCount,
    hiddenCount,
    issueCount: 0,
    errorCount: 0,
    warningCount: 0
  };
}

function emptySummary(): FrontierViewSummary {
  return {
    fieldCount: 0,
    actionCount: 0,
    representationCount: 0,
    flowCount: 0,
    sourcePathCount: 0,
    writePathCount: 0,
    editableCount: 0,
    readonlyCount: 0,
    hiddenCount: 0,
    issueCount: 0,
    errorCount: 0,
    warningCount: 0
  };
}

function diagnostic(
  severity: FrontierViewDiagnosticSeverity,
  code: string,
  message: string,
  extra: Partial<FrontierViewDiagnostic> = {}
): FrontierViewDiagnostic {
  return { severity, code, message, ...extra };
}

function schemaTypeOf(schema: FrontierViewSchemaLike): FrontierViewJsonType {
  if (schema.enum || schema.const !== undefined) return 'enum';
  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
  if (type === 'integer' || type === 'number' || type === 'string' || type === 'boolean' || type === 'array' || type === 'object' || type === 'null') return type;
  if (schema.properties) return 'object';
  if (schema.items) return 'array';
  return 'unknown';
}

function inferTypeFromSchemaPath(schema: FrontierViewSchemaLike | undefined, rootPath: string | undefined, path: string): FrontierViewJsonType | undefined {
  const found = schemaAtPath(schema, rootPath, path);
  return found ? schemaTypeOf(found) : undefined;
}

function inferFormatFromSchemaPath(schema: FrontierViewSchemaLike | undefined, rootPath: string | undefined, path: string): string | undefined {
  return schemaAtPath(schema, rootPath, path)?.format;
}

function inferEnumFromSchemaPath(schema: FrontierViewSchemaLike | undefined, rootPath: string | undefined, path: string): readonly JsonValue[] | undefined {
  return schemaAtPath(schema, rootPath, path)?.enum;
}

function schemaAtPath(schema: FrontierViewSchemaLike | undefined, rootPath: string | undefined, path: string): FrontierViewSchemaLike | undefined {
  if (!schema) return undefined;
  const root = pathToArray(rootPath ?? '');
  const target = pathToArray(path);
  const relative = arraysEqual(root, target.slice(0, root.length)) ? target.slice(root.length) : target;
  let current: FrontierViewSchemaLike | undefined = schema;
  for (const segment of relative) {
    if (!current) return undefined;
    if (typeof segment === 'string') current = current.properties?.[segment];
    else current = Array.isArray(current.items) ? current.items[segment] : current.items;
  }
  return current;
}

function getPathValue(value: JsonValue | undefined, path: FrontierRegistryPath): JsonValue | undefined {
  let current: unknown = value;
  for (const segment of pathToArray(path)) {
    if (current === undefined || current === null) return undefined;
    if (Array.isArray(current)) current = current[Number(segment)];
    else if (typeof current === 'object') current = (current as Record<string, unknown>)[String(segment)];
    else return undefined;
  }
  return toJsonValue(current);
}

function pathToArray(path: FrontierRegistryPath): JsonPath {
  if (Array.isArray(path)) return path.map((segment) => (typeof segment === 'number' ? segment : numericOrString(segment)));
  const value = String(path);
  const cached = pathSegmentCache.get(value);
  if (cached) return cached;
  const parsed = value === '' || value === '/'
    ? []
    : value.startsWith('/')
      ? value.slice(1).split('/').filter(Boolean).map((part) => numericOrString(unescapePointerToken(part)))
      : value.split('.').filter(Boolean).map(numericOrString);
  if (pathSegmentCache.size >= PATH_CACHE_LIMIT) pathSegmentCache.clear();
  pathSegmentCache.set(value, parsed);
  return parsed;
}

function numericOrString(value: string | number): PathSegment {
  if (typeof value === 'number') return value;
  return /^\d+$/.test(value) ? Number(value) : value;
}

function joinPath(base: string, segment: string): string {
  return normalizePath(pathToArray(base).concat(segment));
}

function rebasePath(path: string, fromRoot: string | undefined, toRoot: string): string {
  const pathParts = pathToArray(path);
  const fromParts = pathToArray(fromRoot ?? '');
  const toParts = pathToArray(toRoot);
  const rest = arraysEqual(fromParts, pathParts.slice(0, fromParts.length)) ? pathParts.slice(fromParts.length) : pathParts;
  return normalizePath(toParts.concat(rest));
}

function pathsOverlap(left: string, right: string): boolean {
  const a = pathToArray(left);
  const b = pathToArray(right);
  const min = Math.min(a.length, b.length);
  for (let i = 0; i < min; i++) if (a[i] !== b[i]) return false;
  return true;
}

function evaluateCondition(
  condition: FrontierViewCondition | undefined,
  state: JsonValue | undefined,
  capabilities: Set<string>,
  fallback: boolean
): boolean {
  if (!condition) return fallback;
  if (condition.capability && !capabilities.has(condition.capability)) return false;
  for (const capability of condition.capabilities ?? []) if (!capabilities.has(capability)) return false;
  if (condition.path !== undefined) {
    const value = getPathValue(state, condition.path);
    if (condition.exists !== undefined && (value !== undefined) !== condition.exists) return false;
    if (condition.equals !== undefined && !jsonEqual(value, condition.equals)) return false;
  }
  if (condition.all && !condition.all.every((child) => evaluateCondition(child, state, capabilities, true))) return false;
  if (condition.any && !condition.any.some((child) => evaluateCondition(child, state, capabilities, false))) return false;
  if (condition.not && evaluateCondition(condition.not, state, capabilities, false)) return false;
  return true;
}

function valueMatchesType(value: JsonValue, type: FrontierViewJsonType): boolean {
  if (type === 'unknown' || type === 'enum') return true;
  if (type === 'integer') return typeof value === 'number' && Number.isInteger(value);
  if (type === 'number') return typeof value === 'number';
  if (type === 'array') return Array.isArray(value);
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === 'null') return value === null;
  return typeof value === type;
}

function typeOfJson(value: JsonValue): FrontierViewJsonType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number' && Number.isInteger(value)) return 'integer';
  return typeof value as FrontierViewJsonType;
}

function mergeChannels(
  left: Record<string, FrontierViewChannel>,
  right: Record<string, FrontierViewChannel>
): Record<string, FrontierViewChannel> {
  return { ...left, ...right };
}

function fieldMatchesText(field: FrontierViewField, representation: FrontierViewRepresentation, text: string): boolean {
  return [field.id, field.path, field.label, field.description, field.type, field.format, representation.id, representation.kind]
    .filter(isString)
    .some((value) => value.toLowerCase().includes(text));
}

function cloneManifest(manifest: FrontierViewManifest): FrontierViewManifest {
  return {
    kind: manifest.kind,
    version: manifest.version,
    id: manifest.id,
    name: manifest.name,
    description: manifest.description,
    source: cloneViewSource(manifest.source),
    defaults: cloneDefaults(manifest.defaults),
    fields: manifest.fields.map(cloneField),
    flows: manifest.flows.map(cloneFlow),
    representations: cloneRepresentationRecord(manifest.representations),
    generatedAt: manifest.generatedAt,
    package: manifest.package,
    feature: manifest.feature,
    owner: manifest.owner,
    sourceLocation: cloneRegistrySource(manifest.sourceLocation),
    tags: manifest.tags.slice(),
    diagnostics: manifest.diagnostics.map(cloneDiagnostic),
    summary: { ...manifest.summary },
    metadata: cloneJsonObject(manifest.metadata)
  };
}

function manifestToInput(manifest: FrontierViewManifest): FrontierViewManifestInput {
  return {
    id: manifest.id,
    name: manifest.name,
    description: manifest.description,
    source: cloneViewSource(manifest.source),
    defaults: Object.fromEntries(Object.entries(manifest.defaults).map(([key, value]) => [key, { representation: cloneRepresentation(value.representation), mode: value.mode, validate: value.validate.map(cloneValidationStep), metadata: cloneJsonObject(value.metadata) }])),
    fields: manifest.fields.map(cloneField),
    flows: manifest.flows.map(cloneFlow),
    representations: Object.values(manifest.representations).map(cloneRepresentation),
    generatedAt: manifest.generatedAt,
    package: manifest.package,
    feature: manifest.feature,
    owner: manifest.owner,
    sourceLocation: manifest.sourceLocation,
    tags: manifest.tags,
    metadata: manifest.metadata
  };
}

function cloneField(field: FrontierViewField): FrontierViewField {
  return {
    id: field.id,
    path: field.path,
    sourcePath: field.sourcePath,
    writePath: field.writePath,
    schemaPath: field.schemaPath,
    label: field.label,
    description: field.description,
    type: field.type,
    format: field.format,
    enum: cloneJsonArray(field.enum),
    required: field.required,
    readOnly: field.readOnly,
    writeOnly: field.writeOnly,
    mode: field.mode,
    representation: field.representation ? cloneRepresentation(field.representation) : undefined,
    channels: cloneChannels(field.channels),
    visibleWhen: cloneCondition(field.visibleWhen),
    editableWhen: cloneCondition(field.editableWhen),
    validate: field.validate.map(cloneValidationStep),
    actions: field.actions.map(cloneAction),
    virtual: cloneVirtualHint(field.virtual),
    lod: cloneLodHint(field.lod),
    order: field.order,
    feature: field.feature,
    package: field.package,
    owner: field.owner,
    source: cloneRegistrySource(field.source),
    tags: field.tags.slice(),
    metadata: cloneJsonObject(field.metadata)
  };
}

function cloneFlow(flow: FrontierViewFlow): FrontierViewFlow {
  return {
    id: flow.id,
    label: flow.label,
    mode: flow.mode,
    draftFrom: flow.draftFrom,
    draftPath: flow.draftPath,
    validate: flow.validate.map(cloneValidationStep),
    fieldOverrides: cloneJson(flow.fieldOverrides),
    actions: flow.actions.map(cloneAction),
    submit: flow.submit ? cloneAction(flow.submit) : undefined,
    virtual: cloneVirtualHint(flow.virtual),
    lod: cloneLodHint(flow.lod),
    tags: flow.tags.slice(),
    metadata: cloneJsonObject(flow.metadata)
  };
}

function cloneAction(action: FrontierViewAction): FrontierViewAction {
  return {
    id: action.id,
    action: action.action,
    label: action.label,
    event: action.event,
    mode: action.mode,
    input: cloneJsonValue(action.input),
    requiresValid: action.requiresValid,
    requiresDirty: action.requiresDirty,
    capabilities: action.capabilities.slice(),
    reads: action.reads.slice(),
    writes: action.writes.slice(),
    calls: action.calls.slice(),
    effects: action.effects.slice(),
    triggers: action.triggers.slice(),
    invalidates: action.invalidates.slice(),
    affects: action.affects.slice(),
    tags: action.tags.slice(),
    source: cloneRegistrySource(action.source),
    metadata: cloneJsonObject(action.metadata)
  };
}

function cloneRepresentation(representation: FrontierViewRepresentation): FrontierViewRepresentation {
  return {
    id: representation.id,
    kind: representation.kind,
    target: representation.target,
    channels: cloneChannels(representation.channels),
    variants: { ...representation.variants },
    material: cloneJsonValue(representation.material),
    shader: cloneJsonValue(representation.shader),
    attributes: cloneJsonValue(representation.attributes),
    virtual: cloneVirtualHint(representation.virtual),
    lod: cloneLodHint(representation.lod),
    tags: representation.tags.slice(),
    metadata: cloneJsonObject(representation.metadata)
  };
}

function cloneSchema(schema: FrontierViewSchemaLike): FrontierViewSchemaLike {
  return cloneJson(schema) as FrontierViewSchemaLike;
}

function cloneJson<T>(value: T): T {
  const text = JSON.stringify(value);
  return text === undefined ? value : JSON.parse(text) as T;
}

function cloneJsonArray(values: readonly unknown[]): JsonValue[] {
  return values.map((value) => toJsonValue(value) ?? null);
}

function cloneJsonValue(value: JsonValue | undefined): JsonValue | undefined {
  return value === undefined ? undefined : toJsonValue(value);
}

function cloneJsonObject(value: JsonObject | undefined): JsonObject | undefined {
  return value === undefined ? undefined : cloneJson(value);
}

function cloneViewSource(source: FrontierViewSource | undefined): FrontierViewSource | undefined {
  if (!source) return undefined;
  return {
    path: source.path,
    schema: source.schema ? cloneSchema(source.schema) : undefined,
    query: cloneJsonValue(source.query),
    entity: cloneJsonValue(source.entity),
    metadata: cloneJsonObject(source.metadata)
  };
}

function cloneDefaults(defaults: Record<string, FrontierViewDefault>): Record<string, FrontierViewDefault> {
  const out: Record<string, FrontierViewDefault> = {};
  for (const [key, value] of Object.entries(defaults)) {
    out[key] = {
      key: value.key,
      representation: cloneRepresentation(value.representation),
      mode: value.mode,
      validate: value.validate.map(cloneValidationStep),
      metadata: cloneJsonObject(value.metadata)
    };
  }
  return out;
}

function cloneRepresentationRecord(representations: Record<string, FrontierViewRepresentation>): Record<string, FrontierViewRepresentation> {
  const out: Record<string, FrontierViewRepresentation> = {};
  for (const [key, value] of Object.entries(representations)) out[key] = cloneRepresentation(value);
  return out;
}

function cloneChannels(channels: Record<string, FrontierViewChannel>): Record<string, FrontierViewChannel> {
  const out: Record<string, FrontierViewChannel> = {};
  for (const [key, channel] of Object.entries(channels)) {
    out[key] = {
      from: channel.from,
      value: cloneJsonValue(channel.value),
      scale: channel.scale,
      domain: cloneJsonArray(channel.domain),
      range: cloneJsonArray(channel.range),
      sort: channel.sort,
      aggregate: channel.aggregate,
      axis: cloneJsonObject(channel.axis),
      legend: cloneJsonObject(channel.legend),
      transform: cloneJsonValue(channel.transform),
      updateTriggers: channel.updateTriggers.slice(),
      metadata: cloneJsonObject(channel.metadata)
    };
  }
  return out;
}

function cloneValidationStep(step: FrontierViewValidationStep): FrontierViewValidationStep {
  return {
    id: step.id,
    kind: step.kind,
    code: step.code,
    path: step.path,
    message: step.message,
    severity: step.severity,
    requires: cloneCondition(step.requires),
    metadata: cloneJsonObject(step.metadata)
  };
}

function cloneVirtualHint(virtual: FrontierViewVirtualHint | undefined): FrontierViewVirtualHint | undefined {
  if (!virtual) return undefined;
  return {
    keyBy: virtual.keyBy,
    count: virtual.count,
    itemSize: virtual.itemSize,
    estimatedSize: virtual.estimatedSize,
    overscan: virtual.overscan,
    lanes: virtual.lanes,
    gap: virtual.gap,
    paddingStart: virtual.paddingStart,
    paddingEnd: virtual.paddingEnd,
    scrollPaddingStart: virtual.scrollPaddingStart,
    scrollPaddingEnd: virtual.scrollPaddingEnd,
    scrollMargin: virtual.scrollMargin,
    initialOffset: virtual.initialOffset,
    horizontal: virtual.horizontal,
    enabled: virtual.enabled,
    measureKey: virtual.measureKey,
    rangeExtractor: virtual.rangeExtractor,
    sticky: virtual.sticky.slice(),
    viewport: cloneJsonValue(virtual.viewport),
    axis: virtual.axis,
    rangePath: virtual.rangePath,
    anchorPath: virtual.anchorPath,
    metadata: cloneJsonObject(virtual.metadata)
  };
}

function cloneLodHint(lod: FrontierViewLodHint | undefined): FrontierViewLodHint | undefined {
  if (!lod) return undefined;
  return {
    profile: lod.profile,
    level: lod.level,
    levels: lod.levels.slice(),
    significance: lod.significance,
    observer: lod.observer,
    budget: cloneJsonValue(lod.budget),
    priority: lod.priority,
    cost: lod.cost,
    minZoom: lod.minZoom,
    maxZoom: lod.maxZoom,
    hysteresis: lod.hysteresis,
    degrade: lod.degrade,
    variants: { ...lod.variants },
    metadata: cloneJsonObject(lod.metadata)
  };
}

function cloneCondition(condition: FrontierViewCondition | undefined): FrontierViewCondition | undefined {
  return condition === undefined ? undefined : cloneJson(condition) as FrontierViewCondition;
}

function cloneRegistrySource(source: FrontierRegistrySource | undefined): FrontierRegistrySource | undefined {
  return source === undefined ? undefined : cloneJson(source) as FrontierRegistrySource;
}

function cloneDiagnostic(issue: FrontierViewDiagnostic): FrontierViewDiagnostic {
  return {
    severity: issue.severity,
    code: issue.code,
    message: issue.message,
    viewId: issue.viewId,
    fieldId: issue.fieldId,
    actionId: issue.actionId,
    path: issue.path,
    source: issue.source,
    metadata: cloneJsonObject(issue.metadata)
  };
}

function toJsonObject(value: unknown): JsonObject | undefined {
  if (value === undefined) return undefined;
  const json = toJsonValue(value);
  return json && typeof json === 'object' && !Array.isArray(json) ? json as JsonObject : undefined;
}

function toJsonValue(value: unknown): JsonValue | undefined {
  if (value === undefined) return undefined;
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  const text = JSON.stringify(value);
  return text === undefined ? undefined : JSON.parse(text) as JsonValue;
}

function jsonEqual(left: unknown, right: unknown): boolean {
  if (left === right) return true;
  if (left === null || right === null) return left === right;
  if (typeof left !== 'object' || typeof right !== 'object') return false;
  return stableStringify(left) === stableStringify(right);
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
  const object = value as Record<string, unknown>;
  return '{' + Object.keys(object).sort().filter((key) => object[key] !== undefined).map((key) => JSON.stringify(key) + ':' + stableStringify(object[key])).join(',') + '}';
}

function redactUnknown(value: unknown, keys: Set<string>): unknown {
  if (Array.isArray(value)) return value.map((item) => redactUnknown(item, keys));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) out[key] = keys.has(key.toLowerCase()) ? '[REDACTED]' : redactUnknown(child, keys);
    return out;
  }
  return value;
}

function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

function uniqueSorted(values: readonly string[]): string[] {
  return Array.from(new Set(values)).sort();
}

function titleFromPath(path: string): string {
  const token = String(path).split('/').filter(Boolean).pop() ?? String(path).split('.').filter(Boolean).pop() ?? 'Value';
  return token.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function compareNumber(left: number | undefined, right: number | undefined): number {
  return (left ?? Number.MAX_SAFE_INTEGER) - (right ?? Number.MAX_SAFE_INTEGER);
}

function finiteNumber(value: number | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length !== 0;
}

function isField(value: FrontierViewField | undefined): value is FrontierViewField {
  return value !== undefined;
}

function arraysEqual(left: readonly unknown[], right: readonly unknown[]): boolean {
  if (left.length !== right.length) return false;
  for (let i = 0; i < left.length; i++) if (left[i] !== right[i]) return false;
  return true;
}

function escapePointerToken(value: string): string {
  return value.replace(/~/g, '~0').replace(/\//g, '~1');
}

function unescapePointerToken(value: string): string {
  return value.replace(/~1/g, '/').replace(/~0/g, '~');
}

function isManifest(input: FrontierViewManifest | FrontierViewManifestInput): input is FrontierViewManifest {
  return (input as FrontierViewManifest).kind === FRONTIER_VIEW_MANIFEST_KIND;
}
