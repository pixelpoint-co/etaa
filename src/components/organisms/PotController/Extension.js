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
import Modal from '../../atoms/Modal';
import PotControlButton from '../PotControlButton';
import Flex from '../../atoms/Flex';
import MenuSelect from './MenuSelect';
import Card from '../../atoms/Card';
import Button from '../../atoms/Button';
import useRecipeData from '../../../hooks/useRecipeData';
import TagSelect from '../../molecules/TagSelect';
import {
  recipeTags,
} from '../../../constants/pot';

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
  tiltHome,
  prepCook,
  prepWash,
  dishIn,
  dishOut,
  selectRecipe,
  isCooking,
  startSpin,
  startSpin150,
  startSpin200,
  lastActionType,
  lastActionId,
  spinHome,
  onRecipeSelect,
  machineState,
}) => {
  const {
    data,
    error,
    loading,
  } = useRecipeData();
  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] = useState(310);
  const [
    selectedRecipeId,
    setSelectedRecipeId,
  ] = useState(null);
  const [
    selectedTagList,
    setSelectedTagList,
  ] = useState([]);

  // const recipeIdsMapper = useMemo(
  //   () => ([
  //     {
  //       label: '토마토 파스타',
  //       value: uuidv4(),
  //       recipeIds: _.times(
  //         10,
  //         (v) => v + 25,
  //       ),
  //     },
  //     {
  //       label: '크림 파스타',
  //       value: uuidv4(),
  //       recipeIds: _.times(
  //         10,
  //         (v) => v + 10,
  //       ),
  //     },
  //     {
  //       label: '오일 파스타',
  //       value: uuidv4(),
  //       recipeIds: _.times(
  //         10,
  //         (v) => v + 20,
  //       ),
  //     },
  //     {
  //       label: '토마토 리조또',
  //       value: uuidv4(),
  //       recipeIds: _.times(
  //         10,
  //         (v) => v,
  //       ),
  //     },
  //     {
  //       label: '크림 리조또',
  //       value: uuidv4(),
  //       recipeIds: _.times(
  //         10,
  //         (v) => v + 10,
  //       ),
  //     },
  //     {
  //       label: '스페셜',
  //       value: uuidv4(),
  //       recipeIds: _.times(
  //         10,
  //         (v) => v + 20,
  //       ),
  //     },
  //   ]),
  //   [],
  // );

  const secondaryOptions = useMemo(
    () => {
      const selectedRecipeList = _.filter(
        data,
        { tags: [selectedCategoryId] },
      );

      const recipeList = selectedRecipeList
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
                disabledTooltip={[isCooking ? '조리중입니다' : null]}
                label="레시피 선택"
                onClick={() => {
                  onRecipeSelect();
                }}
              />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton
                label="각도원점"
                onClick={() => {
                  tiltHome();
                  onClose();
                }}
                disabledTooltip={[isCooking ? '조리중입니다' : null]}
                disabled={isCooking}
              />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton
                label="회전원점"
                hideLabelOnLoading
                onClick={() => {
                  spinHome();
                  onClose();
                }}
                active={lastActionType === 'machine' && lastActionId === '회전원점'}
              />
            </PotControlButtonContainer>

            <PotControlButtonContainer>
              <PotControlButton
                label="회전 약"
                hideLabelOnLoading
                onClick={() => {
                  startSpin();
                  onClose();
                }}
                active={lastActionType === 'machine' && lastActionId === '역회전'}
              />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton
                label="회전 중"
                hideLabelOnLoading
                onClick={() => {
                  startSpin150();
                  onClose();
                }}
                active={lastActionType === 'machine' && lastActionId === '역회전'}
              />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton
                label="회전 강"
                hideLabelOnLoading
                onClick={() => {
                  startSpin200();
                  onClose();
                }}
                active={lastActionType === 'machine' && lastActionId === '역회전'}
              />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton
                label="세척준비"
                hideLabelOnLoading
                onClick={prepWash}
                active={lastActionType === 'machine' && lastActionId === '세척준비'}
              />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton
                label="접시넣기"
                hideLabelOnLoading
                onClick={dishIn}
              />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton
                label="접시빼기"
                hideLabelOnLoading
                onClick={dishOut}
              />
            </PotControlButtonContainer>
            {/* <PotControlButtonContainer>
              <PotControlButton
                label="인덕션 끄기"
                disabled
                disabledTooltip={['준비중인 기능입니다']}
              />
            </PotControlButtonContainer>
            <PotControlButtonContainer>
              <PotControlButton
                disabled
                disabledTooltip={['준비중인 기능입니다']}
                label="회전 센서"
              />
            </PotControlButtonContainer> */}
            {/* <PotControlButtonContainer>
              <PotControlButton
                disabled
                disabledTooltip={['준비중인 기능입니다']}
                label="세척 센서"
              />
            </PotControlButtonContainer> */}
          </PotControllerWrapper>
        </Container>
      </Modal>
      <Modal
        isOpen={menuOptionsOpen}
        onClose={() => {
          setSelectedRecipeId(null);
          setSelectedCategoryId(310);
          onMenuOptionsClose();
        }}
      >
        <Container>
          <MenuSelectContainer>
            <MenuOptionsSelectContainer>
              <MenuGroupContainer>
                <MenuSelect
                  value={selectedCategoryId}
                  options={recipeTags.filter((tag) => tag.viewable === true)}
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
                  setSelectedCategoryId(310);
                }}
              />
              <SelectButton
                label="선택"
                disabled={selectedRecipeId == null}
                onClick={() => {
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
