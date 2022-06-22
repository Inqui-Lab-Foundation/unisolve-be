
export interface courseModuleAttributes {
    course_module_id: number;
    course_id: string;
    description: string;
    status: Enumerator;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}

export interface teamAttributes {
    team_id: number;
    team_name: string;
    mentor_id: string;
    status: Enumerator;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}
export interface courseVideosAttributes {
    course_video_id: number;
    video_stream_id: string;
    status: Enumerator;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}

  export interface userCtopicProgressAttributes {
    user_ctopic_progress_id: number;
    user_id: number;
    course_topic_id: number;
    status: Enumerator;
    created_at: Date;
    updated_at: Date;
  }
  
