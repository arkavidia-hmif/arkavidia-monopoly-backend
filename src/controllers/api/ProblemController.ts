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
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";

export class ProblemBase {
  @IsString()
  public statement?: string;

  @IsNumber()
  public answer?: number;
}

export class CreateProblemBody extends ProblemBase {
  @IsString()
  public statement: string;

  @IsNumber()
  public answer: number;
}

export class UpdateProblemBody extends ProblemBase {
  @IsString()
  public statement?: string;

  @IsNumber()
  public answer?: number;
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
  @ResponseSchema(ProblemResponse, { isArray: true })
  @OpenAPI({
    description: "Get all problems.",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async getAllProblems(): Promise<ProblemResponse[]> {
    return await this.problemService.getAll();
  }

  @Get("/random")
  @ResponseSchema(ProblemResponse)
  @OpenAPI({
    description: "Get random problem.",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async getRandomProblem(): Promise<ProblemResponse> {
    return await this.problemService.getRandom();
  }

  @Get("/:id")
  @ResponseSchema(ProblemResponse)
  @OpenAPI({
    description: "Get problem by ID.",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async getProblemById(
    @Param("id") id: string
  ): Promise<ProblemResponse> {
    return await this.problemService.getOne(id);
  }

  @Post("/")
  @ResponseSchema(ProblemResponse)
  @OpenAPI({
    description: "Create new problem.",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async createProblem(
    @Body() data: CreateProblemBody
  ): Promise<ProblemResponse> {
    return await this.problemService.create(data);
  }

  @Delete("/:id")
  @ResponseSchema(null)
  @OpenAPI({
    description: "Delete problem by ID.",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async deleteProblem(@Param("id") id: string): Promise<null> {
    await Problem.findByIdAndDelete(id);
    return null;
  }

  @Put("/:id")
  @ResponseSchema(ProblemResponse)
  @OpenAPI({
    description: "Update problem by ID, allows partial update.",
    responses: {
      "200": {
        description: "OK",
      },
    },
  })
  public async updateProblem(
    @Param("id") id: string,
    @Body() data: UpdateProblemBody
  ): Promise<ProblemResponse> {
    return await this.problemService.update(id, data);
  }
}
