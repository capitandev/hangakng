import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { BoardArticleService } from './board-article.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BoardArticle, BoardArticles,} from '../../libs/dto/board-article/board-article';
import {AllBoardArticlesInquiry, BoardArticleInput,BoardArticlesInquiry,} from '../../libs/dto/board-article/board-article.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { BoardArticleUpdate } from '../../libs/dto/board-article/board-article.update';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class BoardArticleResolver {
  constructor(private readonly boardArticleService: BoardArticleService) {}
  // create board article
  @UseGuards(AuthGuard)
  @Mutation(() => BoardArticle)
  public async createBoardArticle(
    @Args('input') input: BoardArticleInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<BoardArticle> {
    console.log('Mutation: createBoardArticle');

    return await this.boardArticleService.createBoardArticle(memberId, input);
  }

  // getBoardArticle
  @UseGuards(WithoutGuard)
  @Query(() => BoardArticle)
  public async getBoardArticle(
    @Args('articleId') input: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<BoardArticle> {
    console.log('Query: getProperty');
    const articleId = shapeIntoMongoObjectId(input);
    return await this.boardArticleService.getBoardArticle(memberId, articleId);
  }

  // updateBoardArticle

  @UseGuards(AuthGuard)
  @Mutation(() => BoardArticle)
  public async updateBoardArticle(
    @Args('input') input: BoardArticleUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<BoardArticle> {
    console.log('Mutation: updateBoardArticle');
    input._id = shapeIntoMongoObjectId(input._id);

    return await this.boardArticleService.updateBoardArticle(memberId, input);
  }

  // get board articles

  @UseGuards(WithoutGuard)
  @Query(() => BoardArticles)
  public async getBoardArticles(
    @Args('input') input: BoardArticlesInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<BoardArticles> {
    console.log('Query: getBoardArticles');
    return await this.boardArticleService.getBoardArticles(memberId, input);
  }

  //likeTargetBoardArticle

  @UseGuards(AuthGuard)
  @Mutation(() => BoardArticle)
  public async likeTargetBoardArticle(
    @Args('articleId') input: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<BoardArticle> {
    console.log('Mutation: likeTargetBoardArticle');
    const likeRefId = shapeIntoMongoObjectId(input);
    return await this.boardArticleService.likeTargetBoardArticle(
      memberId,
      likeRefId,
    );
  }

  /** ADMIN */

  //getAllBoardArticlesByAdmin
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => BoardArticles)
  public async getAllBoardArticlesByAdmin(
    @Args('input') input: AllBoardArticlesInquiry,
    // @AuthMember('_id') memberId: ObjectId,
  ): Promise<BoardArticles> {
    console.log('Query: getAllBoardArticlesByAdmin');

    return await this.boardArticleService.getAllBoardArticlesByAdmin(input);
  }

  // updateBoardArticlesByAdmin

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => BoardArticle)
  public async updateBoardArticlesByAdmin(
    @Args('input') input: BoardArticleUpdate,
    // @AuthMember("_id" memberId: ObjectId)
  ): Promise<BoardArticle> {
    console.log('Mutation: updateBoardArticlesByAdmin');
    input._id = shapeIntoMongoObjectId(input._id);

    return await this.boardArticleService.updateBoardArticlesByAdmin(input);
  }

  // removeBoardArticleByAdmin
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => BoardArticle)
  public async removeBoardArticleByAdmin(
    @Args('articleId') input: string,
  ): Promise<BoardArticle> {
    console.log('Mutation: removeBoardArticlesByAdmin');

    const articleId = shapeIntoMongoObjectId(input);

    return await this.boardArticleService.removeBoardArticleByAdmin(articleId);
  }
}