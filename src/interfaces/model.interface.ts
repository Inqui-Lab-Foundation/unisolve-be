
export interface courseModuleAttributes {
    module_id: number;
    // course_id: string;
    description: string;
    status: Enumerator;
}

export interface teamAttributes {
    team_id: number;
    team_name: string;
    mentor_id: string;
    status: Enumerator;
}
export interface videosAttributes {
    video_id: number;
    module: string;
    video_stream_id: string;
    status: Enumerator;
}