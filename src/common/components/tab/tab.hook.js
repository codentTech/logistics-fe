'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DOCUMENT_TABS from '@/common/constants/document-tabs.constant';
import DOCUMENT from '@/common/constants/document.constants';
import {
  DOCUMENT_PRODUCTS,
  DOCUMENT_URL
} from '@/common/utils/document-helpers/document-helpers';
import { getSingleCustomer } from '@/provider/features/customer/customer.slice';
import { getSingleDeliveryNotes } from '@/provider/features/delivery-notes/delivery-notes.slice';
import { getSingleInvoice } from '@/provider/features/invoice/invoice.slice';
import { getSingleOffer } from '@/provider/features/offer/offer.slice';
import { getSingleOrder } from '@/provider/features/order/order.slice';

export default function useTabHook({ tabs, module }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const displayId = searchParams.get('d-id');
  const convertedFrom = searchParams.get('from');
  const currentTab = searchParams.get('currentTab');

  const [activeTab, setActiveTab] = useState(currentTab || tabs[0]?.id);
  const [completedTab, setCompletedTab] = useState([]);

  useEffect(() => {
    if (searchParams.get('id')) {
      getDocumentData();
    }
  }, [searchParams, id, module]);

  const getDocumentData = async () => {
    const payload = searchParams.get('id') || module.id;
    const response =
      module === DOCUMENT.OFFER
        ? await dispatch(getSingleOffer({ payload }))
        : module === DOCUMENT.ORDER
        ? await dispatch(getSingleOrder({ payload }))
        : module === DOCUMENT.INVOICE
        ? await dispatch(getSingleInvoice({ payload }))
        : module === DOCUMENT.DELIVERY_NOTES
        ? await dispatch(getSingleDeliveryNotes({ payload }))
        : module === DOCUMENT.CUSTOMER
        ? await dispatch(getSingleCustomer({ payload }))
        : null;

    const data = response?.payload;

    if (data) {
      setCompletedTab((prevCompletedTab) => {
        if (
          data.customer &&
          data[`${DOCUMENT_PRODUCTS(module)}Products`] &&
          data[`${DOCUMENT_PRODUCTS(module)}Products`]?.length === 0
        ) {
          // setActiveTab(DOCUMENT_TABS.CUSTOMER_DETAILS);
          return [...prevCompletedTab, DOCUMENT_TABS.CUSTOMER_DETAILS];
        } else if (
          data[`${DOCUMENT_PRODUCTS(module)}Products`] &&
          data[`${DOCUMENT_PRODUCTS(module)}Products`].length &&
          !data[`${DOCUMENT_PRODUCTS(module)}BodyId`] &&
          !data[`${DOCUMENT_PRODUCTS(module)}DisclaimerId`]
        ) {
          // setActiveTab(DOCUMENT_TABS.LINE_ITEMS);
          return [
            ...prevCompletedTab,
            DOCUMENT_TABS.CUSTOMER_DETAILS,
            DOCUMENT_TABS.LINE_ITEMS
          ];
        } else if (
          data[`${DOCUMENT_PRODUCTS(module)}BodyId`] &&
          data[`${DOCUMENT_PRODUCTS(module)}DisclaimerId`] &&
          !data[`${DOCUMENT_PRODUCTS(module)}TemplateId`]
        ) {
          // setActiveTab(DOCUMENT_TABS.PAGE_STRUCTURE);
          return [
            ...prevCompletedTab,
            DOCUMENT_TABS.CUSTOMER_DETAILS,
            DOCUMENT_TABS.LINE_ITEMS,
            DOCUMENT_TABS.PAGE_STRUCTURE
          ];
        } else if (
          data.customer &&
          data[`${DOCUMENT_PRODUCTS(module)}Products`] &&
          data[`${DOCUMENT_PRODUCTS(module)}Products`]?.length &&
          data[`${DOCUMENT_PRODUCTS(module)}BodyId`] &&
          data[`${DOCUMENT_PRODUCTS(module)}DisclaimerId`]
        ) {
          return [
            ...prevCompletedTab,
            DOCUMENT_TABS.CUSTOMER_DETAILS,
            DOCUMENT_TABS.LINE_ITEMS,
            DOCUMENT_TABS.PAGE_STRUCTURE,
            DOCUMENT_TABS.PREVIEW
          ];
        } else {
          // If none of the conditions are met, return the previous state
          return [...prevCompletedTab, DOCUMENT_TABS.CUSTOMER_DETAILS];
        }
      });
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    router.push(
      DOCUMENT_URL({
        id,
        displayId,
        convertedFrom
      })
    );
  };

  const handleTabCompleted = (tabId) => {
    setCompletedTab([...new Set([...completedTab, tabId])]);
  };

  const resetTabCompleted = () => {
    setCompletedTab([]);
  };

  let Component = tabs.find((tab) => tab.id === activeTab)?.content;
  Component = {
    ...Component,
    props: {
      handleTabClick,
      handleTabCompleted,
      resetTabCompleted,
      setActiveTab
    }
  };

  tabs[tabs.findIndex((tab) => tab.id === activeTab)].content = Component;

  return {
    syntaticTabs: tabs,
    activeTab,
    setActiveTab,
    completedTab,
    setCompletedTab,
    handleTabClick,
    resetTabCompleted,
    Component
  };
}
