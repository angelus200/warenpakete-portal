import { PartialType } from '@nestjs/swagger';
import { CreateKnowledgeProductDto } from './create-knowledge-product.dto';

export class UpdateKnowledgeProductDto extends PartialType(CreateKnowledgeProductDto) {}
