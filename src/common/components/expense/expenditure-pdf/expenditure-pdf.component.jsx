'use client';

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */

import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import formatAmount from '@/common/utils/fomate-amount';
import logo from './assets/logo.png';

export default function ExpenditurePdf({ expenditure }) {
  Font.register({
    family: 'DM Sans',
    fonts: [
      { src: 'fonts/DMSans-Regular.ttf', fontWeight: 'Normal' },
      { src: 'fonts/DMSans-Medium.ttf', fontWeight: 'Medium' },
      { src: 'fonts/DMSans-Bold.ttf', fontWeight: 'Bold' }
    ]
  });
  const styles = StyleSheet.create({
    page: { backgroundColor: '#FFF', position: 'relative' },
    logoContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'space-between'
    },
    flexSpaceBetween: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center'
    },
    textStyle_12_500_18: {
      color: '#2C2E3E',
      fontSize: '10px',
      fontStyle: 'normal',
      fontWeight: 'Medium'
    },
    textStyle_10_400_12: {
      color: '#46474F',
      fontSize: '10px',
      fontStyle: 'normal',
      fontWeight: 'normal'
    },
    textStyle_12_700_18: {
      color: '#2C2E3E',
      fontSize: '10px',
      fontStyle: 'normal',
      fontWeight: 'Bold'
    },
    textStyle_12_400_18_light: {
      color: '#46474F',
      fontSize: '8px',
      fontStyle: 'normal',
      fontWeight: 'Normal'
    },
    textStyle_12_400_18: {
      color: '#2C2E3E',
      fontSize: '8px',
      fontStyle: 'normal',
      fontWeight: 'Normal'
    },
    textStyle_16_500_24: {
      color: '#2C2E3E',
      fontSize: '10px',
      fontStyle: 'normal',
      fontWeight: 'Medium'
    },
    offerToStyle: {
      display: 'flex',
      width: '150px',
      flexDirection: 'row',
      gap: '7px'
    }
  });
  return (
    <Document>
      <Page style={styles.page}>
        <View
          style={{
            position: 'absolute',
            top: '-110px',
            left: '-100px',
            backgroundColor: 'blue',
            minHeight: '150px',
            width: '150px',
            transform: 'rotate(50deg)'
          }}
        ></View>
        <View style={{ padding: '16px' }}>
          <View style={styles.logoContainer}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: ' 20px ',
                gap: '4px',
                alignItems: 'center'
              }}
            >
              <Text style={styles.textStyle_12_500_18}>Expenditure #</Text>
              <Text style={styles.textStyle_12_400_18_light}>{expenditure.id}</Text>
            </View>

            <View style={{ width: '100px', height: '32px', marginRight: '10px' }}>
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  resizeMode: 'contain'
                }}
                source={logo.src}
                quality={1}
                dpi={300}
                alt="logo"
              />
            </View>
          </View>
          <View style={[styles.flexSpaceBetween, { marginTop: '16px' }]}>
            <View style={styles.offerToStyle}>
              <Text style={[styles.textStyle_10_400_12, { paddingLeft: '20px' }]}>
                Customer:
              </Text>
            </View>
            <View style={styles.offerToStyle}>
              <Text style={styles.textStyle_10_400_12}>{`${
                (expenditure?.customer && expenditure?.customer?.companyName) || ''
              } ${
                expenditure?.customer?.firstName || expenditure?.customer?.firstName
                  ? `( ${
                      expenditure?.customer && expenditure?.customer?.firstName
                        ? expenditure?.customer?.firstName
                        : ''
                    } ${
                      expenditure?.customer && expenditure?.customer?.lastName
                        ? expenditure?.customer?.lastName
                        : ''
                    } )`
                  : '' || ''
              } `}</Text>
            </View>
          </View>
          <View style={[styles.flexSpaceBetween, { marginTop: '8px' }]}>
            <View style={styles.offerToStyle}>
              <Text style={[styles.textStyle_10_400_12, { paddingLeft: '20px' }]}>
                Cash Discount:
              </Text>
            </View>
            <View style={styles.offerToStyle}>
              <Text style={styles.textStyle_10_400_12}>
                {`${expenditure?.cashDiscount || 0}%` || '---'}
              </Text>
            </View>
          </View>
          <View style={[styles.flexSpaceBetween, { marginTop: '8px' }]}>
            <View style={styles.offerToStyle}>
              <Text style={[styles.textStyle_10_400_12, { paddingLeft: '20px' }]}>
                Cash Discount Validity Date:
              </Text>
            </View>
            <View style={styles.offerToStyle}>
              <Text style={styles.textStyle_10_400_12}>
                {expenditure?.cashDiscountValidity || '---'}
              </Text>
            </View>
          </View>
          <View style={[styles.flexSpaceBetween, { marginTop: '8px' }]}>
            <View style={styles.offerToStyle}>
              <Text style={[styles.textStyle_10_400_12, { paddingLeft: '20px' }]}>
                Payment Amount:
              </Text>
            </View>
            <View style={styles.offerToStyle}>
              <Text style={styles.textStyle_10_400_12}>
                {formatAmount(expenditure?.paymentAmount) || '---'}
              </Text>
            </View>
          </View>
          <View style={[styles.flexSpaceBetween, { marginTop: '8px' }]}>
            <View style={styles.offerToStyle}>
              <Text style={[styles.textStyle_10_400_12, { paddingLeft: '20px' }]}>
                Due Date:
              </Text>
            </View>
            <View style={styles.offerToStyle}>
              <Text style={styles.textStyle_10_400_12}>
                {expenditure?.dueDate || '---'}{' '}
              </Text>
            </View>
          </View>
          <View style={[styles.flexSpaceBetween, { marginTop: '8px' }]}>
            <View style={styles.offerToStyle}>
              <Text style={[styles.textStyle_10_400_12, { paddingLeft: '20px' }]}>
                Receipt Date:
              </Text>
            </View>
            <View style={styles.offerToStyle}>
              <Text style={styles.textStyle_10_400_12}>
                {expenditure?.receiptDate || '---'}{' '}
              </Text>
            </View>
          </View>
          <View
            style={{
              // height: '104px',
              padding: '8px 20px',
              marginTop: '16px',
              display: 'flex',
              borderRadius: '10px',
              backgroundColor: '#FAFAFA',
              gap: '8px'
            }}
          >
            <View style={styles.flexSpaceBetween}>
              <Text style={styles.textStyle_12_400_18_light}>Payment Amount</Text>
              <Text style={styles.textStyle_12_400_18_light}>
                {formatAmount(expenditure?.paymentAmount)}
              </Text>
            </View>

            <View style={styles.flexSpaceBetween}>
              <Text style={styles.textStyle_12_400_18}>Balance</Text>
              <Text style={styles.textStyle_12_400_18}>
                {formatAmount(
                  Number(expenditure?.paymentAmount) -
                    Number(expenditure?.paymentAmount) *
                      (Number(expenditure?.cashDiscount) / 100)
                )}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

ExpenditurePdf.propTypes = {
  expenditure: PropTypes.objectOf
};
