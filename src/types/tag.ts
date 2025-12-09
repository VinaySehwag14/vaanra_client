/**
 * Tag types for product tagging
 */

export interface Tag {
    id: number;
    name: string;
}

/**
 * Request body for creating a tag (Admin)
 */
export interface CreateTagRequest {
    name: string;
}

/**
 * Response from getting tags
 */
export interface TagsResponse {
    success: boolean;
    tags: Tag[];
}

/**
 * Response from creating a tag
 */
export interface CreateTagResponse {
    success: boolean;
    tag: Tag;
}
