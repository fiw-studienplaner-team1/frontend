
export interface EnrolledModule {
    enrollmentId: number;
    moduleId: string;
    name: string;
    ects: number;
    sws: number;
}

export interface Enrollment {
    enrollmentId: number;
    planId: number;
    offeringId: number;
    moduleId: string;
    moduleName: string;
}

export interface Semesterplan {
    planId: number;
    semesterId: number;
    semesterLabel: string;
    modules: EnrolledModule[];
}
