import {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import _, {
  findLast,
  get,
} from 'lodash';
import {
  v4 as uuidv4,
} from 'uuid';
import moment from 'moment';
import useRecipeData from './useRecipeData';

const machineUrl = [
  'http://192.168.0.200:4100/api/v1',
  'http://192.168.0.199:4100/api/v1',
  'http://192.168.0.198:4100/api/v1',
  'http://192.168.0.197:4100/api/v1',
  'http://192.168.0.196:4100/api/v1',
  'http://192.168.0.195:4100/api/v1',
];

const usePotController = (cookerId, opts = {}) => {
  const {
    data: recipeData,
    error: recipeError,
    loading: recipeLoading,
  } = useRecipeData();
  const [
    selectedRecipeId,
    setSelectedRecipeId,
  ] = useState(null);
  const [
    selectedOrderKitchenId,
    setSelectedOrderKitchenId,
  ] = useState(null);

  const spinStart = () => {
    global.api.post(
      `${machineUrl[cookerId]}/cooker/0/start-spin`,
    );
  };
  const spinStop = () => {
    global.api.post(
      `${machineUrl[cookerId]}/cooker/0/stop-spin`,
    );
  };
  const home = () => {
    global.api.post(
      `${machineUrl[cookerId]}/cooker/0/home`,
    );
  };
  const spinHome = () => {
    global.api.post(
      `${machineUrl[cookerId]}/cooker/0/spin-home`,
    );
  };
  const prepCook = () => {
    global.api.post(
      `${machineUrl[cookerId]}/cooker/0/prep-cook`,
    );
  };
  const startCook = (data = {}) => {
    global.api.post(
      `${machineUrl[cookerId]}/cooker/0/start-cook`,
      {
        recipeId: selectedRecipeId,
        ...data,
      },
    );
  };
  const startWash = () => {
    global.api.post(
      `${machineUrl[cookerId]}/cooker/0/start-wash`,
    );
  };
  const prepWash = () => {
    global.api.post(
      `${machineUrl[cookerId]}/cooker/0/prep-wash`,
    );
  };
  const finishCook = () => {
    global.api.post(
      `${machineUrl[cookerId]}/cooker/0/finish-cook`,
    );
  };
  const selectRecipe = (recipeId, orderKitchenId) => {
    console.log(
      'eftg: ',
      recipeId,
      orderKitchenId,
    );
    // global.api.post(
    //   `/cooker/${cookerId}/prep-cook`,
    //   {
    //     recipeId,
    //     orderKitchenId,
    //   },
    // );
    setSelectedRecipeId(recipeId);
    setSelectedOrderKitchenId(orderKitchenId);
  };
  const selectedRecipe = useMemo(
    () => _.find(
      recipeData,
      { id: selectedRecipeId },
    ),
    [
      recipeData,
      selectedRecipeId,
    ],
  );

  return {
    prepCook,
    selectRecipe,
    spinStart,
    spinStop,
    home,
    startWash,
    prepWash,
    startCook,
    finishCook,
    spinHome,
    selectedRecipeId,
    selectedRecipe,
    selectedOrderKitchenId,
  };
};
export default usePotController;
