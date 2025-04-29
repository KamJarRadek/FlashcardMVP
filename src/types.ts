import {Database, FlashcardsStatus, FlashcardsSource} from "./db/database.types";

/** Request to generate proposals */
export interface GenerateProposalsRequestDto {
  text: string;
  maxCount: number;
}

/** Single proposal for flashcard */
export type ProposalDto = Pick<
  Database['public']['Tables']['flashcards']['Insert'],
  'definition' | 'concept'
>;

/** Response for generate proposals */
export interface GenerateProposalsResponseDto {
  proposals: ProposalDto[];
}

/** Request to accept proposals */
export interface AcceptProposalsRequestDto {
  proposals: ProposalDto[];
}

/** Flashcard basic response DTO */
export type FlashcardResponseDto = Pick<
  Database['public']['Tables']['flashcards']['Row'],
  'id' | 'definition' | 'concept' | 'status' | 'source' | 'created_at'
>;

/** Response after accepting proposals */
export interface AcceptProposalsResponseDto {
  items: FlashcardResponseDto[];
}

/** Request to create manual flashcard */
export type CreateFlashcardManualRequestDto = ProposalDto;

/** Response after manual flashcard creation */
export type CreateFlashcardManualResponseDto = FlashcardResponseDto;

/** Query params for listing flashcards */
export interface ListFlashcardsQueryDto {
  status?: FlashcardsStatus;
  source?: FlashcardsSource;
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'updated_at';
  order?: 'asc' | 'desc';
}

/** Flashcard DTO for list responses */
export type FlashcardDto = Pick<
  Database['public']['Tables']['flashcards']['Row'],
  'id' | 'definition' | 'concept' | 'status' | 'source' | 'created_at' | 'updated_at'
>;

/** Pagination metadata */
export interface PageMetaDto {
  page: number;
  limit: number;
  total: number;
}

/** Response for listing flashcards */
export interface ListFlashcardsResponseDto {
  items: FlashcardDto[];
  meta: PageMetaDto;
}

/** Request to update a flashcard */
export type UpdateFlashcardRequestDto = Partial<
  Pick<Database['public']['Tables']['flashcards']['Update'], 'definition' | 'concept' | 'status'>
>;

/** Response for updating a flashcard */
export type UpdateFlashcardResponseDto = FlashcardDto;

/** Query params for study mode */
export interface StudyFlashcardsQueryDto {
  limit?: number;
}

/** Single flashcard in study mode */
export type StudyFlashcardDto = Pick<
  Database['public']['Tables']['flashcards']['Row'],
  'id' | 'definition' | 'concept'
>;

/** Response for study mode */
export interface StudyFlashcardsResponseDto {
  items: StudyFlashcardDto[];
}

/** Response for usage statistics */
export interface GetUsageStatisticsResponseDto {
  bySource: Record<FlashcardsSource, number>;
  byStatus: Record<FlashcardsStatus, number>;
}

/** DTO for login request */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/** DTO for OAuth request */
export interface OAuthRequestDto {
  provider: string;
  token: string;
}

/** User DTO */
export interface UserDto {
  id: string;
  email: string;
}

/** Response for authentication */
export interface AuthResponseDto {
  accessToken: string;
  user: UserDto;
}
