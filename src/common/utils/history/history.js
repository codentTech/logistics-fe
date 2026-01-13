const manageHistory = ({ payload, rowData }) => {
  const response =
    payload && payload.length
      ? payload?.slice(0, payload.length - 1).map((obj, index) => {
          const currentStatus = obj.status;
          const { convertedFrom, createdByName, createdAt, updatedAt } = obj;
          const previousStatus = payload[index + 1]?.status;
          return {
            currentStatus,
            previousStatus,
            createdByName,
            createdAt,
            updatedAt,
            convertedFrom
          };
        })
      : [];

  // Add the most recent status change at the beginning of the array
  response &&
    response.unshift({
      currentStatus: payload[payload.length - 1]?.status,
      previousStatus: rowData?.status,
      createdByName: rowData?.createdByName,
      createdAt: rowData?.createdAt,
      updatedAt: rowData?.updatedAt,
      convertedFrom: payload[payload.length - 1]?.convertedFrom || rowData?.convertedFrom
    });

  return response;
};

export default manageHistory;
