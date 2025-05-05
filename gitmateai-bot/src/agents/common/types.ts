
export interface SearchQuery {
    content: string,
    limit?: number,
    fields?: string[];
}

export interface SearchIssueQuery extends SearchQuery{
    exclude?: {
        owner?: string | string[];
        repo?: string | string[];
        issueNumber?: number | number[];
    };
}

