type StringValue = `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

const sessionConfig = {
  maxAge: 1000 * 60 * 60 * 24 * 30, //1 month
  jwtExpiresIn: '30d' as StringValue, //1 month
};

export default sessionConfig;
