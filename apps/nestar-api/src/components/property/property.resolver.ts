import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PropertyService } from './property.service';
import { Properties, Property } from '../../libs/dto/property/property';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertyInput, PropertiesInquiry, AgentPropertiesInquiry, AllPropertiesInquiry, OrdinaryInquiry, } from '../../libs/dto/property/property.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { PropertyUpdate } from '../../libs/dto/property/property.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class PropertyResolver {
  constructor(private readonly propertyService: PropertyService) {}

  // create property
  @Roles(MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Mutation(() => Property)
  public async createProperty(
    @Args('input') input: PropertyInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Property> {
    console.log('Mutation: createProperty');
    input.memberId = memberId;
    return this.propertyService.createProperty(input);
  }

  // get property

  @UseGuards(WithoutGuard)
  @Query(() => Property)
  public async getProperty(
    @Args('propertyId') input: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Property> {
    console.log('Query: getProperty');
    const propertyId = shapeIntoMongoObjectId(input);
    return await this.propertyService.getProperty(memberId, propertyId);
  }

   // update property

   @Roles(MemberType.AGENT)
   @UseGuards(RolesGuard)
   @Mutation(() => Property)
   public async updateProperty(
     @Args('input') input: PropertyUpdate,
     @AuthMember('_id') memberId: ObjectId,
   ): Promise<Property> {
     console.log('Mutation: updateProperty');
     input._id = shapeIntoMongoObjectId(input._id);
     return await this.propertyService.updateProperty(memberId, input);
   }


  // get properties

  @UseGuards(WithoutGuard)
  @Query(() => Properties)
  public async getProperties(
    @Args('input') input: PropertiesInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Properties> {
    console.log('Query: getProperties');
    return await this.propertyService.getProperties(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => Properties)   
  public async getFavorites(
      @Args('input') input: OrdinaryInquiry, 
      @AuthMember('_id') memberId: ObjectId,  
  ): Promise<Properties> {
      console.log('Query: getFavorites');
      return await this.propertyService.getFavorites(memberId, input);
  }


  @UseGuards(AuthGuard)
  @Query((returns) => Properties)   
  public async getVisited(
      @Args('input') input: OrdinaryInquiry, 
      @AuthMember('_id') memberId: ObjectId,  
  ): Promise<Properties> {
      console.log('Query: getVisited');
      return await this.propertyService.getVisited(memberId, input);
  }

   // get agent properties

   @Roles(MemberType.AGENT)
   @UseGuards(RolesGuard)
   @Query(() => Properties)
   public async getAgentProperties(
     @Args('input') input: AgentPropertiesInquiry,
     @AuthMember('_id') memberId: ObjectId,
   ): Promise<Properties> {
     console.log('Query: getAgentProperties');
     return await this.propertyService.getAgentProperties(memberId, input);
   }

   //likeTargetProperties

  @UseGuards(AuthGuard)
  @Mutation(() => Property)
  public async likeTargetProperty(
    @Args('propertyId') input: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Property> {
    console.log('Mutation: likeTargetProperty');
    const likeRefId = shapeIntoMongoObjectId(input);
    return await this.propertyService.likeTargetProperty(memberId, likeRefId);
  }
 
   /**  ADMIN */


    // getAllPropertiesByAdmin
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Properties)
  public async getAllPropertiesByAdmin(
    @Args('input') input: AllPropertiesInquiry,
    // @AuthMember('_id') memberId: ObjectId,
  ): Promise<Properties> {
    console.log('Query: gettAllPropertiesByAdmin');
    return await this.propertyService.getAllPropertiesByAdmin(input);
  }

   // updatePropertyByAdmin

   @Roles(MemberType.ADMIN)
   @UseGuards(RolesGuard)
   @Mutation(() => Property)
   public async updatePropertyByAdmin(
     @Args('input') input: PropertyUpdate,
   ): Promise<Property> {
     console.log('MUtation: updatePropertyByAdmin');
     input._id = shapeIntoMongoObjectId(input._id);
     return await this.propertyService.updatePropertyByAdmin(input);
   }

   // removePropertyByAdmin

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Property)
  public async removePropertyByAdmin(
    @Args('propertyId') input: string,
  ): Promise<Property> {
    console.log('Mutation: removePropertyByAdmin');
    const propertyId = shapeIntoMongoObjectId(input);
    return await this.propertyService.removePropertyByAdmin(propertyId);
  }
}