import Problem from "@/models/Problem";
import { ProblemService } from "@/services/ProblemService";
import { IsNumber, IsString } from "class-validator";
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

export class ProblemBase {
  @IsString()
  public statement: string;

  @IsNumber()
  public answer: number;
}

export class CreateProblemBody extends ProblemBase {
  @IsString()
  public statement: string;

  @IsNumber()
  public answer: number;
}

export class UpdateProblemBody extends ProblemBase {
  @IsString()
  public statement: string;

  @IsNumber()
  public answer: number;
}

export class ProblemResponse extends ProblemBase {
  @IsString()
  public _id?: string;

  @IsNumber()
  public __v?: number;
}

@JsonController("/problem")
@OpenAPI({ security: [{ basicAuth: [] }] })
export class ProblemController {
  constructor(private problemService: ProblemService) {}

  @Get("/")
  public async getAllProblems(): Promise<ProblemResponse[]> {
    return await this.problemService.getAll();
  }

  @Get("/:id")
  public async getProblemById(
    @Param("id") id: string
  ): Promise<ProblemResponse> {
    return await this.problemService.getOne(id);
  }

  @Get("/random")
  public async getRandomProblem(): Promise<ProblemResponse> {
    return await this.problemService.getRandom();
  }

  @Post("/")
  public async createProblem(
    @Body() data: Partial<ProblemResponse>
  ): Promise<ProblemResponse> {
    return await this.problemService.create(data);
  }

  @Delete("/:id")
  public async deleteProblem(@Param("id") id: string): Promise<null> {
    await Problem.findByIdAndDelete(id);
    return null;
  }

  @Put("/:id")
  public async updateProblem(
    @Param("id") id: string,
    @Body() data: Partial<ProblemResponse>
  ): Promise<ProblemResponse> {
    return await this.problemService.update(id, data);
  }
}
