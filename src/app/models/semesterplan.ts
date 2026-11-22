

export interface Enrollment {
    id: number;
    semesterPlanId: number; 
    moduleOfferingId: number; 
    moduleId: number; 
    moduleName: string; 
    ects: number;
    weeklyHours: number;
}

export interface Semesterplan {
    id: number;
    semesterId: number;
    semesterLabel: string;
    modules: Enrollment[];
}
