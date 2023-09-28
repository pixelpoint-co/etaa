// startDate: String, endDate:String, limit:Int = 25, offset:Int = 0

export default (options = {}) => {
  const {
    limit,
    offset,
    id,
  } = options;

  return {
    data: [],
    count: 0,
    loading: false,
    error: null,
  };
};
