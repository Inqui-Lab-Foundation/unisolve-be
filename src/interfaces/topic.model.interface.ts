export default interface topicAttribute {
    topic_id: number;
    course_id: number;
    module_id: number;
    topic_type_id: number;
    topic_type: Enumerator;
    status: Enumerator;
    created_by: number;
    created_at: Date;
    updated_by: number;
    updated_at: Date;
}