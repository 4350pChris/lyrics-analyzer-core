import dynamoose from 'dynamoose';

const artistSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    songs: {
      type: Array,
      schema: [{
        type: Object,
        schema: {
          id: {
            type: String,
          },
          name: {
            type: String,
            // required: true,
          },
          text: {
            type: String,
            // required: true,
          },
        },
      }],
    },
  },
  {
    timestamps: true,
  }
);

export const ArtistModel = dynamoose.model('Artist', artistSchema);
