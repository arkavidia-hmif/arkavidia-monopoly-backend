import Problem, { IProblem } from "@/models/Problem";
import { Service } from "typedi";

@Service()
export class ProblemService {
  public async getAll(): Promise<IProblem[]> {
    return await Problem.find({});
  }

  public async getOne(id: string): Promise<IProblem> {
    return await Problem.findById(id);
  }

  public async getRandom(): Promise<IProblem> {
    const problems = await Problem.find({});
    return problems[Math.floor(Math.random() * problems.length)];
  }

  public async create(data: Partial<IProblem>): Promise<IProblem> {
    return await new Problem(data).save();
  }

  public async delete(id: string): Promise<null> {
    await Problem.findByIdAndDelete(id);
    return null;
  }

  public async update(id: string, data: Partial<IProblem>): Promise<IProblem> {
    return await Problem.findByIdAndUpdate(id, data, { new: true });
  }
}
