export interface evaluatorAttributes {
    id: number;
    evaluator_name: string;
    mobile: number;
    organization: string,
    city: string,
    email: string;
    status: Enumerator;
}

export interface mentorAttributes {
    id: number;
    mentor_name: string;
    mobile: number;
    email: string;
    status: Enumerator;
}

export interface courseAttributes {
    id: number;
    course_id: string;
    description: string;
    status: Enumerator;
}

export interface studentAttributes {
    id: string;
    team_id: string;
    student_name: string;
    mobile: number;
    email: string;
    password: string;
    date_of_birth: string;
    institute_name: string;
    stream: string;
    city: string;
    district: string;
    state: string;
    country: string;
    status: Enumerator
}

export interface teamAttributes {
    id: number;
    team_name: string;
    mentor_id: string;
    status: Enumerator;
}
export interface videosAttributes {
    id: number;
    module: string;
    video_id: string;
    status: Enumerator;
}