// FRONTEND
export interface IHasId {
    id?: number;
}

export interface IHasTitle {
    title: string;
}

export interface IHasDescription {
    description: string;
}

export interface IBreadCrumb extends IHasTitle {
    path: string;
}

// BACKEND

// ENUMS
export enum EnrollmentActionType {
    REGISTER = 'REGISTER',
    INVITATION = 'INVITATION',
    RELATION = 'RELATION'
}

export enum InvitationStatus {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING'
}

export enum InvitationType {
    DEFAULT = 'DEFAULT'
}

export enum DepartmentType {
    DEFAULT = 'DEFAULT',
    CUSTOM = 'CUSTOM'
}

export enum CorporateType {
    PERSONAL = 'PERSONAL',
    CORPORATE = 'CORPORATE'
}

export enum Currency {
    EGP = 'EGP',
    USD = 'USD',
    EURO = 'EURO'
}

export enum TeamType {
    CUSTOM = 'CUSTOM',
    DEFAULT = 'DEFAULT'
}

export enum ProjectRequestStatus {
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum ProjectRequestType {
    CHANGE_REQUEST = 'CHANGE_REQUEST',
    INITIAL_REQUEST = 'INITIAL_REQUEST'
}

export enum Status {
    PENDING = 'PENDING',
    RECEIVED = 'RECEIVED'
}

// INTERFACES
export interface IUser {
    id: number;
    userEntities: IUserEntity[];
    userEntityEnrollment: IUserEntityEnrollment[];
}

export interface IUserEntity {
    id: number;
    email: string;
    password: string;
    name: string;
    userId: number;
    user: IUser;
    members: IMember[];
    tasks: ITask[];
}

export interface IUserEntityEnrollment {
    id: number;
    email: string;
    token: string;
    invitationStatus: InvitationStatus;
    enrollmentActionType: EnrollmentActionType;
    invitationType: InvitationType;
    invitationId?: number | null;
    inviterId?: number | null;
    inviter?: IUser | null;
    invitation?: IInvitation | null;
}

export interface IWorkmatiqInvitation {
    id: number;
    projectId: number;
    teamId: number;
    roleId: number;
}

export interface IRoleRoverInvitation {
    id: number;
}

export interface ICorporate {
    id: number;
    title: string;
    description: string;
    corporateType: CorporateType;
    departments: IDepartment[];
    projects: IProject[];
}

export interface IDepartment {
    id: number;
    title: string;
    description: string;
    departmentType: DepartmentType;
    corporateId: number;
    corporate: ICorporate;
    employees: IEmployee[];
}

export interface IEmployee {
    id: number;
    userId: number;
    departmentId: number;
    department: IDepartment;
}

export interface IProject {
    id: number;
    title: string;
    description: string;
    expectedEnd?: Date | null;
    budget?: number | null;
    expectedRevenue?: number | null;
    actualRevenue?: number | null;
    expectedBudget?: number | null;
    actualBudget?: number | null;
    creatorId: number;
    corporateId: number;
    projectPreference?: IProjectPreference | null;
    projectBudgets: IProjectBudget[];
    expenses: IExpense[];
    teams: ITeam[];
    tags: IProjectTag[];
    members: IMember[];
    workspaces: IWorkspace[];
    statusLists: IStatusList[];
    corporate: ICorporate;
}

export interface IProjectTag {
    id: number;
    content: string;
    color: string;

    projectId: number;

    project: IProject;
}

export interface ITaskTag {
    id: number;

    taskId: number;
    projectTagId: number;

    task: ITask;
    projectTag: IProjectTag;
}

export interface IProjectRequest {
    id: number;
    deadline?: Date | null;
    costBudget?: number | null;
    timeBudget?: string | null;
    quote: number;
    rejectionReason?: string | null;
    requestType: ProjectRequestType;
    requestStatus: ProjectRequestStatus;
    currency?: Currency | null;
    customerId?: number | null;
    approvedById: number;
}

export interface IProjectBudget {
    id: number;
    title: string;
    amount: number;
    projectId: number;
    projectExpenseCategoryId?: number | null;
    project: IProject;
    projectExpenseCategory?: IProjectExpenseCategory | null;
}

export interface IWorkspaceBudget {
    id: number;
    title: string;
    amount: string;
    workspaceId?: number | null;
    workspace?: IWorkspace | null;
}

export interface IExpense {
    id: number;
    cost: number;
    status: string;
    attachment: string;
    approvedBy: string;
    addedById: string;
    projectId: number;
    workspaceId?: number | null;
    projectExpenseCategoryId?: number | null;
    project: IProject;
    workspace?: IWorkspace | null;
    projectExpenseCategory?: IProjectExpenseCategory | null;
}

export interface IProjectExpenseCategory {
    id: number;
    title: string;
    projectBudgets: IProjectBudget[];
    expenses: IExpense[];
}

export interface IProjectPreference {
    id: number;
    currency: Currency;
    projectId: number;
    project: IProject;
}

export interface ITeam {
    id: number;
    title: string;
    description: string;
    type: TeamType;
    roleId: number;
    projectId: number;
    project: IProject;
    members: IMember[];
    invitations: IInvitation[];
}

export interface IInvitation {
    id: number;
    status: InvitationStatus;
    teamId: number;
    roleId: number;
    team: ITeam;
    Member: IMember[];
    UserEntityEnrollment: IUserEntityEnrollment[];
}

export interface IMember {
    id: number;
    payrate?: number | null;
    userId: number;
    employeeId?: number | null;
    projectId: number;
    invitationId?: number | null;
    teamId?: number | null;
    userEntity: IUserEntity;
    team?: ITeam | null;
    project: IProject;
    invitation?: IInvitation | null;
    workspaceMember: IWorkspaceMember[];
    taskMembers: ITaskMember[];
}

export interface IWorkspace {
    id: number;
    title: string;
    description: string;
    budget: number;
    projectId: number;
    parentWorkspaceId?: number | null;
    expenses: IExpense[];
    worksheets: IWorksheet[];
    workspaceMembers: IWorkspaceMember[];
    workspaceBudgets: IWorkspaceBudget[];
    project: IProject;
    parentWorkspace?: IWorkspace | null;
    childWorkspaces: IWorkspace[];
}

export interface IWorkspaceMember {
    id: number;
    workspaceId: number;
    memberId: number;
    workspace: IWorkspace;
    member: IMember;
}

export interface IWorksheet {
    id: number;
    title: string;
    description: string;
    workspaceId: number;
    statusListId: number;
    workspace: IWorkspace;
    statusList: IStatusList;
    tasks: ITask[];
}

export interface IStatusList {
    id: number;
    projectId: number;
    project: IProject;
    worksheets: IWorksheet[];
}

export interface ITask {
    id: number;
    title: string;
    description: string;
    worksheetId: number;
    createdById: number;
    categoryId?: number | null;
    parentTaskId?: number | null;
    dependsOnTaskId?: number | null;
    dependsOn?: number | null;
    worksheet: IWorksheet;
    createdBy: IUserEntity;
    parentTask?: ITask | null;
    dependsOnTask?: ITask | null;
    taskMembers: ITaskMember[];
    taskComments: ITaskComment[];
    dependentTasks: ITask[];
    childTasks: ITask[];
    taskTags: ITaskTag[]
    taskAttachments: ITaskAttachment[]
}

export interface ITaskMember {
    id: number;
    taskId: number;
    memberId: number;
    task: ITask;
    member: IMember;
}

export interface ITaskComment {
    id: number;
    content: string;
    taskId: number;
    task: ITask;
    createdBy: IUserEntity;
}

export interface ITaskAttachment {
    id: number;
    url: string;
    taskId: number;

    thumbnails: IAttachmentThumbnail[];
}

export interface IAttachmentThumbnail {
    id: number;
    url: string;
    attachmentId: number;
}

export interface INotification {
    id: number;
    content: string;
}

export interface INotificationRecipient {
    id: number;
}

export interface IRecipient {
    id: number;
    status: Status;
    userId: number;
}
