/**
 * Common WordPress API types for medical application
 * These types provide strong typing for WordPress REST API responses
 */

/** WordPress rendered content structure */
export interface WPRenderedContent {
  readonly rendered: string;
  readonly protected?: boolean;
}

/** WordPress featured media item */
export interface WPFeaturedMedia {
  readonly id: number;
  readonly source_url: string;
  readonly alt_text?: string;
  readonly media_type?: 'image' | 'video' | 'audio';
  readonly mime_type?: string;
  readonly media_details?: {
    readonly width?: number;
    readonly height?: number;
    readonly sizes?: Record<
      string,
      {
        readonly file: string;
        readonly width: number;
        readonly height: number;
        readonly source_url: string;
      }
    >;
  };
}

/** WordPress taxonomy term */
export interface WPTerm {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly taxonomy?: string;
  readonly description?: string;
  readonly parent?: number;
  readonly count?: number;
}

/** WordPress embedded data structure */
export interface WPEmbedded {
  readonly 'wp:featuredmedia'?: readonly WPFeaturedMedia[];
  readonly 'wp:term'?: readonly (readonly WPTerm[])[];
  readonly 'wp:author'?: readonly Array<{
    readonly id: number;
    readonly name: string;
    readonly slug: string;
    readonly avatar_urls?: Record<string, string>;
  }>;
}

/** Base WordPress post interface */
export interface WPPost {
  readonly id: number;
  readonly title: WPRenderedContent;
  readonly content: WPRenderedContent;
  readonly excerpt: WPRenderedContent;
  readonly date: string;
  readonly date_gmt: string;
  readonly modified: string;
  readonly modified_gmt: string;
  readonly slug: string;
  readonly status: 'publish' | 'draft' | 'private' | 'pending' | 'future';
  readonly type: string;
  readonly link: string;
  readonly author: number;
  readonly featured_media: number;
  readonly comment_status: 'open' | 'closed';
  readonly ping_status: 'open' | 'closed';
  readonly sticky: boolean;
  readonly template: string;
  readonly format: string;
  readonly meta: Record<string, unknown>;
  readonly categories: readonly number[];
  readonly tags: readonly number[];
  readonly _embedded?: WPEmbedded;
  readonly _links?: Record<string, unknown>;
}

/** WordPress page interface extending post */
export interface WPPage extends WPPost {
  readonly parent: number;
  readonly menu_order: number;
  readonly page_template?: string;
}

/** WordPress doctor custom post type */
export interface WPDoctor {
  readonly id: number;
  readonly title: WPRenderedContent;
  readonly content: WPRenderedContent;
  readonly date: string;
  readonly date_gmt: string;
  readonly modified: string;
  readonly modified_gmt: string;
  readonly slug: string;
  readonly status: 'publish' | 'draft' | 'private';
  readonly type: 'info-bacsi';
  readonly link: string;
  readonly featured_media: number;
  readonly template: string;
  readonly meta: Record<string, unknown>;
  readonly _embedded?: Pick<WPEmbedded, 'wp:featuredmedia'>;
  readonly _links?: Record<string, unknown>;

  // Medical-specific custom fields (bacsi_* fields)
  readonly bacsi_chucdanh?: string; // Position/Title
  readonly bacsi_chuyenmon?: string; // Specialization
  readonly bacsi_donvi?: string; // Department/Unit
  readonly bacsi_kinhnghiem?: string; // Experience
  readonly bacsi_ngonngu?: string; // Languages
  readonly bacsi_trangthai?: string; // Status (available/unavailable)
  readonly bacsi_hocvan?: string; // Education
  readonly bacsi_bangcap?: string; // Qualifications
  readonly bacsi_phongkham?: string; // Clinic/Office
  readonly bacsi_lichkham?: string; // Schedule
  readonly bacsi_phikham?: string; // Consultation fee
  readonly bacsi_dienthoai?: string; // Phone
  readonly bacsi_email?: string; // Email
  readonly bacsi_facebook?: string; // Facebook
  readonly bacsi_zalo?: string; // Zalo
  readonly bacsi_website?: string; // Website
  readonly bacsi_diachi?: string; // Address
  readonly bacsi_mota?: string; // Description
  readonly bacsi_thutu?: string; // Order/Priority

  // Contact information
  readonly phone?: string;
  readonly email?: string;
  readonly facebook?: string;
  readonly zalo?: string;
  readonly website?: string;
  readonly department?: string;

  // Legacy fields for backward compatibility
  readonly specialization?: string;
  readonly experience_years?: number;
  readonly qualifications?: readonly string[];
  readonly department_id?: number;
  readonly consultation_fee?: number;
  readonly availability?: Record<string, unknown>;
}

/** WordPress search result interface */
export interface WPSearchResult {
  readonly id: number;
  readonly title: string;
  readonly url: string;
  readonly type: 'post' | 'page' | 'info-bacsi' | string;
  readonly subtype: string;
  readonly _embedded?: Partial<WPEmbedded>;
}

/** API Error response structure */
export interface WPAPIError {
  readonly code: string;
  readonly message: string;
  readonly data?: {
    readonly status: number;
    readonly params?: Record<string, unknown>;
  };
}

/** Common API response wrapper */
export interface WPAPIResponse<T> {
  readonly data?: T;
  readonly error?: WPAPIError;
  readonly headers?: Record<string, string>;
  readonly status: number;
}
