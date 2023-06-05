import styled from 'styled-components';
import {
  palette,
} from 'styled-tools';
import {
  v4 as uuidv4,
} from 'uuid';
import {
  useMemo,
  useState,
} from 'react';
import _ from 'lodash';
import {
  toast,
} from 'react-toastify';
import Modal from '../../atoms/Modal';
import PotControlButton from '../PotControlButton';
import Flex from '../../atoms/Flex';
import MenuSelect from './MenuSelect';
import Card from '../../atoms/Card';
import Button from '../../atoms/Button';
import useReceipeData from '../../../hooks/useReceipeData';
import TagSelect from '../../molecules/TagSelect';

const Container = styled(Flex)`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  background-color: ${palette(
    'grayscale',
    5,
  )};
  padding: 30px;
  border-radius: 15px;
  overflow: hidden;
`;
const PotControllerWrapper = styled(Flex)`
  position: relative;
  flex-wrap: wrap;
  align-self: stretch;
  margin: -8px -8px;
  max-width: 700px;
  flex-basis: 700px;
  flex: 0%;
`;
const PotControlButtonContainer = styled(Flex)`
  /* flex-basis: 240px; */
  flex-basis: 30%;
  /* max-width: 240px; */
  min-height: 220px;
  max-width: 33.3%;
  /* flex-basis: 33%; */
  padding: 8px;
`;
const Column = styled(Card)`
  margin: 0px 10px;
  padding: 10px;
  max-height: 580px;
  min-height: 100%;
  flex-basis: 150px;
  overflow: auto;
`;
const MenuSelectContainer = styled(Flex)`
  flex: 1;
  flex-direction: column;
  min-height: 90vh;
  max-height: 90vh;
  min-width: 90vw;
  max-width: 90vw;
`;
const ButtonContainer = styled(Flex)`
  flex-direction: row;
  justify-content: stretch;
  flex: 0;
  margin: 0 -10px;
  margin-top: 20px;
`;
const SelectButton = styled(Button)`
  flex: 1;
  margin: 0 10px;
`;
const MenuOptionsSelectContainer = styled(Flex)`
  margin: 0px -10px;
  flex-direction: row;
  flex-wrap: nowrap;
`;
const MenuGroupContainer = styled(Column)`
  flex: 1 0 150px;
`;
const MenuListContainer = styled(Column)`
  flex: 2 0 150px;
`;
const MenuOptionsContainer = styled(Column)`
  flex: 2.5 0 150px;
`;
const PotControllerExtension = ({
  isOpen,
  onClose,
  menuOptionsOpen,
  onMenuOptionsClose,
  onSelect,
  prepIngredientAngle,
  prepNoodle,
  selectRecipe,
  isCooking,
  rotateStart,
  lastActionType,
  lastActionId,
  resetPosition,
  prepWashing,
  onRecipeSelect,
}) => {
  const {
    data,
    error,
    loading,
  } = useReceipeData();
  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] = useState(null);
  const [
    selectedRecipeId,
    setSelectedRecipeId,
  ] = useState(null);
  const [
    selectedTagList,
    setSelectedTagList,
  ] = useState([]);

  const recipeIdsMapper = useMemo(
    () => ([
      {
        label: '토마토 파스타',
        value: uuidv4(),
        recipeIds: _.times(
          10,
          (v) => v + 25,
        ),
      },
      {
        label: '크림 파스타',
        value: uuidv4(),
        recipeIds: _.times(
          10,
          (v) => v + 10,
        ),
      },
      {
        label: '오일 파스타',
        value: uuidv4(),
        recipeIds: _.times(
          10,
          (v) => v + 20,
        ),
      },
      {
        label: '토마토 리조또',
        value: uuidv4(),
        recipeIds: _.times(
          10,
          (v) => v,
        ),
      },
      {
        label: '크림 리조또',
        value: uuidv4(),
        recipeIds: _.times(
          10,
          (v) => v + 10,
        ),
      },
      {
        label: '스페셜',
        value: uuidv4(),
        recipeIds: _.times(
          10,
          (v) => v + 20,
        ),
      },
    ]),
    [],
  );
  const secondaryOptions = useMemo(
    () => {
      const selectedRecipeList = _.get(
        _.find(
          recipeIdsMapper,
          (v) => v.value === selectedCategoryId,
        ),
        'recipeIds',
        [],
      );
      const recipeList = selectedRecipeList
        .map((id) => {
          return _.find(
            data,
            (d) => d.id === id,
          );
        })
        .filter((v) => v != null)
        .map((v) => ({
          ...v,
          label: v.name,
          value: v.id,
        }));
      return recipeList;
    },
    [
      data,
      selectedCategoryId,
      recipeIdsMapper,
    ],
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <Container>
          <PotControllerWrapper>
            <PotControlButtonContainer>
              <PotControlButton
                disabled={isCooking}
                label="레시피 선택"
                onClick={() => {
                  onRecipeSelect();
                }}
              />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton
                label="재료담기"
                onClick={() => {
                  prepIngredientAngle();
                  onClose();
                }}
              />
            </PotControlButtonContainer>

            <PotControlButtonContainer>
              <PotControlButton label="회전 센서" />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton label="세척 센서" />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton label="인덕션 끄기" />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton
                label="세척준비"
                hideLabelOnLoading
                onClick={prepWashing}
                active={lastActionType === 'machine' && lastActionId === '세척준비'}
              />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton
                label="역회전"
                hideLabelOnLoading
                onClick={rotateStart}
                active={lastActionType === 'machine' && lastActionId === '역회전'}
              />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton
                label="원점정지"
                hideLabelOnLoading
                onClick={resetPosition}
                active={lastActionType === 'machine' && lastActionId === '원점정지'}
              />
            </PotControlButtonContainer>
          </PotControllerWrapper>
        </Container>
      </Modal>
      <Modal
        isOpen={menuOptionsOpen}
        onClose={() => {
          setSelectedRecipeId(null);
          setSelectedCategoryId(null);
          onMenuOptionsClose();
        }}
      >
        <Container>
          <MenuSelectContainer>
            <MenuOptionsSelectContainer>
              <MenuGroupContainer>
                <MenuSelect
                  value={selectedCategoryId}
                  options={recipeIdsMapper}
                  onSelect={(value) => {
                    setSelectedCategoryId(value);
                    if (value !== selectedCategoryId) {
                      setSelectedRecipeId(null);
                    }
                  }}
                  buttonOffTheme={{
                    tone: 3,
                    themeType: 'text',
                  }}
                  buttonStyle={{
                    fontWeight: 'bold',
                    fontSize: 30,
                    lineHeight: '30px',
                  }}
                />
              </MenuGroupContainer>
              <MenuListContainer>
                <MenuSelect
                  value={selectedRecipeId}
                  onSelect={(v) => setSelectedRecipeId(v)}
                  options={secondaryOptions}
                  buttonTheme={{
                    themeType: 'outline',
                    tone: 2,
                  }}
                  buttonOffTheme={{
                    themeType: 'text',
                    tone: 3,
                  }}
                />
              </MenuListContainer>
              {/* <MenuOptionsContainer>
              <TagSelect
                label="some-label"
                isMulti
                onSelect={(v) => {
                  console.log(v);
                  setSelectedTagList(v);
                }}
                value={selectedTagList}
                options={_
                  .times(5)
                  .map((i) => ({
                    label: i + 1,
                    value: i,
                  }))}
              />
              <TagSelect
                label="some-label"
                isMulti
                onSelect={(v) => {
                  console.log(v);
                  setSelectedTagList(v);
                }}
                value={selectedTagList}
                options={_
                  .times(5)
                  .map((i) => ({
                    label: i + 1,
                    value: i,
                  }))}
              />
            </MenuOptionsContainer> */}
            </MenuOptionsSelectContainer>

            <ButtonContainer>
              <SelectButton
                palette="grayscale"
                themeType="text"
                tone={2}
                label="취소"
                onClick={() => {
                  onMenuOptionsClose();
                  setSelectedRecipeId(null);
                  setSelectedCategoryId(null);
                }}
              />
              <SelectButton
                label="선택"
                disabled={selectedRecipeId == null}
                onClick={() => {
                  console.log(
                    '선택!',
                    selectedRecipeId,
                  );
                  selectRecipe(selectedRecipeId);
                  onMenuOptionsClose();
                }}
              />
            </ButtonContainer>
          </MenuSelectContainer>
        </Container>
      </Modal>
    </>
  );
};

export default PotControllerExtension;
