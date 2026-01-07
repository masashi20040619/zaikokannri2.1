
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Prize, PrizeCategory, Manufacturer } from '../types';
import PlusIcon from './icons/PlusIcon';

interface PrizeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prize: Prize) => void;
  prizeToEdit?: Prize | null;
}

const prizeCategories: PrizeCategory[] = ['マスコット', 'ぬいぐるみ', 'フィギュア', 'その他'];
const prizeManufacturers: Manufacturer[] = ['指定なし', 'バンダイナムコ', 'タイトー', 'SEGA FAVE', 'FuRyu', 'Parade', 'SK', 'その他'];

const PrizeFormModal: React.FC<PrizeFormModalProps> = ({ isOpen, onClose, onSave, prizeToEdit }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [photo, setPhoto] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<PrizeCategory>('その他');
  const [manufacturer, setManufacturer] = useState<Manufacturer>('指定なし');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
