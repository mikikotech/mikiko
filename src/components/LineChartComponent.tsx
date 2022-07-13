import {useColorMode} from 'native-base';
import React from 'react';
import {ColorValue} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {
  BG_BOX_DARK,
  BG_DARK,
  BG_LIGHT,
  ITEM_HEIGHT_H2,
  ITEM_HEIGHT_H3,
  ITEM_WIDTH_H1,
  ITEM_WIDTH_H4,
  PRIMARY_COLOR,
} from '../utils/constanta';

interface Props {
  key: number;
  name: string;
  labelSurfix: string;
  data: number[];
  labels?: any;
  color?: string;
  RGBAColor?: string;
}

const LineChartComponent = ({
  key,
  name,
  labelSurfix,
  data,
  labels,
  color,
  RGBAColor,
}: Props) => {
  const {colorMode} = useColorMode();

  return (
    <>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
          legend: [name],
        }}
        width={ITEM_WIDTH_H1} // from react-native
        height={ITEM_HEIGHT_H2 * 0.7}
        yAxisSuffix={labelSurfix}
        yAxisInterval={1} // optional, defaults to 1
        yLabelsOffset={ITEM_WIDTH_H4 / 3}
        withInnerLines={false}
        withOuterLines={false}
        fromZero={true}
        verticalLabelRotation={-25}
        chartConfig={{
          backgroundColor: colorMode == 'light' ? BG_LIGHT : BG_BOX_DARK,
          backgroundGradientFrom: colorMode == 'light' ? BG_LIGHT : BG_BOX_DARK,
          backgroundGradientTo: colorMode == 'light' ? BG_LIGHT : BG_BOX_DARK,
          backgroundGradientToOpacity: colorMode == 'light' ? 0 : 1,
          backgroundGradientFromOpacity: colorMode == 'light' ? 0 : 1,
          fillShadowGradient: colorMode == 'light' ? BG_LIGHT : BG_BOX_DARK,
          fillShadowGradientTo: colorMode == 'light' ? BG_LIGHT : BG_BOX_DARK,
          fillShadowGradientFrom: colorMode == 'light' ? BG_LIGHT : BG_BOX_DARK,
          fillShadowGradientOpacity: colorMode == 'light' ? 0 : 1,
          fillShadowGradientToOpacity: colorMode == 'light' ? 0 : 1,
          fillShadowGradientFromOpacity: colorMode == 'light' ? 0 : 1,

          linejoinType: 'round',
          decimalPlaces: 0, // optional, defaults to 2dp
          // color: (opacity = 1) => `rgba(${RGBAColor}, ${opacity})`,
          // labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          color: (opacity = 1) => `rgba(22, 155, 126, ${opacity})`,
          style: {
            borderRadius: 12,
          },
          propsForDots: {
            r: '4',
            // stroke: color,
            stroke: PRIMARY_COLOR,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          paddingVertical: 8,
          borderRadius: 12,
          backgroundColor: colorMode == 'light' ? BG_LIGHT : BG_BOX_DARK,
          borderColor: colorMode == 'light' ? BG_DARK : BG_BOX_DARK,
          borderWidth: 1,
        }}
      />
    </>
  );
};

export default LineChartComponent;
