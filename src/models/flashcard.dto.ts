import { IsString, IsInt, Min, Max, MaxLength } from 'class-validator';

// DTO żądania
export class GenerateProposalsRequestDto {
  @IsString()
  @MaxLength(10000)
  text: string;

  @IsInt()
  @Min(1)
  @Max(20)
  maxCount: number;
}

// Model propozycji fiszki
export class FlashcardProposalDto {
  definition: string;
  concept: string;
}

// DTO odpowiedzi
export class GenerateProposalsResponseDto {
  proposals: FlashcardProposalDto[];
}

// Command dla serwisu
export class GenerateFlashcardProposalsCommand {
  constructor(
    public readonly userId: string,
    public readonly text: string,
    public readonly maxCount: number,
  ) {}
}
