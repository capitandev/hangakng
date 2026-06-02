import { ObjectId } from 'bson';
export const availableAgentsSorts = [
  'createdAt',
  'updatedAt',
  'memberLikes',
  'memberViews',
  'memberRank',
];
export const availableMemberSorts = [
  'createdAt',
  'updatedAt',
  'memberLikes',
  'memberViews',
];
export const availableOptions = ['propertyBarter', 'propertyRent'];
export const availablePropertySorts = [
  'createdAt',
  'updatedAt',
  'propertyLikes',
  'propertyViews',
  'propertyRank',
  'propertyPrice',
];
export const availableBoardArticleSorts = [
  'createdAt',
  'updatedAt',
  'articleLikes',
  'articleViews',
];

export const avaiableCommentSorts = ['createdAt', 'updatedAt'];
/** IMAGE CONFIGURATION (config.js) */
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { T } from './types/common';
export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
  const ext = path.parse(filename).ext;
  return uuidv4() + ext;
};

export const lookupAuthMemberLiked = (
  memberId: T,
  targetRefId: string = '$_id',
) => {
  return {
    $lookup: {
      from: 'likes',
      let: {
        localLikeRefId: targetRefId,
        localMemberId: memberId,
        localMyFavourite: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$likeRefId', '$$localLikeRefId'] },
                { $eq: ['$memberId', '$$localMemberId'] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            memberId: 1,
            likeRefId: 1,
            myFavorite: '$$localMyFavourite',
          },
        },
      ],
      as: 'meLiked',
    },
  };
};

interface LookupAuthMemberFollowed {
  followerId: T;
  followingId: string;
}

export const lookupAuthMemberFollowed = (input: LookupAuthMemberFollowed) => {
  const { followerId, followingId } = input;
  return {
    $lookup: {
      from: 'follows',
      let: {
        localFollowerId: followerId,
        localFollowingId: followingId,
        localMyFavourite: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$followerId', '$$localFollowerId'] },
                { $eq: ['$followingId', '$$localFollowingId'] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            followerId: 1,
            followingId: 1,
            myFollowing: '$$localMyFavourite',
          },
        },
      ],
      as: 'meFollowed',
    },
  };
};

export const shapeIntoMongoObjectId = (target: any) => {
  return typeof target === 'string' ? new ObjectId(target) : target;
};
export const lookupMember = {
  $lookup: {
    from: 'members',
    localField: 'memberId',
    foreignField: '_id',
    as: 'memberData',
  },
};

export const lookupFollowingData = {
  $lookup: {
    from: 'members',
    localField: 'followingId',
    foreignField: '_id',
    as: 'followingData',
  },
};

export const lookupFollowerData = {
  $lookup: {
    from: 'members',
    localField: 'followerId',
    foreignField: '_id',
    as: 'followerData',
  },
};

export const lookupFavorite = {
	$lookup: {
		from: 'members',
		localField: 'favoriteProperty.memberId',
		foreignField: '_id',
		as: 'favoriteProperty.memberData',
	},
};

export const lookupVisit = {
	$lookup: {
		from: 'members',
		localField: 'visitedProperty.memberId',
		foreignField: '_id',
		as: 'visitedProperty.memberData',
	},
};

                                                              //------------------- POSTMAN -----------------
//  imageUploader
//  operations: { "query": "mutation ImageUploader($file: Upload!, $target: String!) { imageUploader(file: $file, target: $target) }", "variables": { "file": null, "target": "member" }}
//  map: { "0": ["variables.file"] }
//  0: File
//  imagesUploader
//  operations: { "query": "mutation ImagesUploader($files: [Upload!]!, $target: String!) { imagesUploader(files: $files, target: $target) }", "variables": { "files": [null, null, null, null], "target": "property" }}
//  map: { "0": ["variables.files.0"], "1": ["variables.files.1"], "2": ["variables.files.2"], "3": ["variables.files.3"], "4": ["variables.files.4"] }
//  0: File
//  1: File
//  2: File
//  3: File
//  4: File