import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Tag,
  User,
  Mail,
  Phone,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { itemsService } from '../services/itemsService';
import { ItemType, CATEGORIES, CAMPUS_LOCATIONS, Item } from '../types/item';
import { ImageUpload } from '../components/ImageUpload/ImageUpload';

export const ReportItemPage: React.FC = () => {
  // Form state
  const [reportType, setReportType] = useState<ItemType>('LOST');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<string>(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [itemDate, setItemDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Contact State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // UI States
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedItem, setSubmittedItem] = useState<Item | null>(null);

  // Calculate today's max date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  // Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 2) {
      errs.title = 'Item title must be at least 2 characters long.';
    } else if (title.trim().length > 150) {
      errs.title = 'Item title cannot exceed 150 characters.';
    }

    if (!description.trim() || description.trim().length < 5) {
      errs.description = 'Please provide a descriptive explanation (at least 5 characters).';
    }

    const resolvedLocation = isCustomLocation ? customLocation.trim() : location;
    if (!resolvedLocation) {
      errs.location = 'Please specify where the item was lost or found.';
    }

    if (!itemDate) {
      errs.itemDate = 'Please select a valid date.';
    } else if (itemDate > todayStr) {
      errs.itemDate = 'Date cannot be in the future.';
    }

    if (!contactName.trim() || contactName.trim().length < 2) {
      errs.contactName = 'Please enter your name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail.trim()) {
      errs.contactEmail = 'Email address is required so owners can contact you.';
    } else if (!emailRegex.test(contactEmail.trim())) {
      errs.contactEmail = 'Please provide a valid email address (e.g. name@student.aast.edu).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('type', reportType);
      formData.append('category', category);
      formData.append('location', isCustomLocation ? customLocation.trim() : location);
      formData.append('item_date', itemDate);
      formData.append('contact_name', contactName.trim());
      formData.append('contact_email', contactEmail.trim());

      if (contactPhone.trim()) {
        formData.append('contact_phone', contactPhone.trim());
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const created = await itemsService.createItem(formData);
      setSubmittedItem(created);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while submitting your report.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setCategory(CATEGORIES[0]);
    setDescription('');
    setLocation(CAMPUS_LOCATIONS[0]);
    setCustomLocation('');
    setIsCustomLocation(false);
    setItemDate(todayStr);
    setImageFile(null);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setErrors({});
    setSubmitError(null);
    setSubmittedItem(null);
  };

  // SUCCESS STATE SCREEN
  if (submittedItem) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-12 h-12 stroke-[2]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Report Confirmed &amp; Stored
            </span>
            <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
              Thank You! Your Report is Published
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Your {submittedItem.type.toLowerCase()} item report for{' '}
              <strong className="text-slate-900 font-semibold">"{submittedItem.title}"</strong> has been persistently recorded in the database.
            </p>
          </div>

          {/* Report summary card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-left max-w-md mx-auto space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Report ID:</span>
              <span className="font-mono font-bold text-slate-800">#{submittedItem.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Report Type:</span>
              <span className={`font-bold uppercase ${submittedItem.type === 'LOST' ? 'text-amber-600' : 'text-emerald-600'}`}>
                {submittedItem.type}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Category:</span>
              <span className="font-medium text-slate-800">{submittedItem.category}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Location:</span>
              <span className="font-medium text-slate-800">{submittedItem.location}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Contact Email:</span>
              <span className="font-medium text-slate-800">{submittedItem.contact_email}</span>
            </div>
          </div>

          {/* Next Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/items"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-navy-900 hover:bg-navy-800 shadow-md transition-colors text-sm sm:text-base"
            >
              <span>View in Lost &amp; Found Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Submit Another Report</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* PAGE HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-100 text-navy-800 text-xs font-bold uppercase tracking-wider">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Campus Submission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Report an Item
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Whether you lost something precious or found an item on campus, fill out the details below to help make a quick reconnection.
        </p>
      </div>

      {submitError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-800 text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Submission Failed</span>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      {/* UNIFIED REPORT FORM */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8">
        
        {/* SECTION A: REPORT TYPE SELECTION */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900">
            What are you reporting? <span className="text-rose-500">*</span>
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* I Lost Something Option */}
            <button
              type="button"
              onClick={() => setReportType('LOST')}
              className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${
                reportType === 'LOST'
                  ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  reportType === 'LOST'
                    ? 'bg-amber-500 text-navy-950 shadow-sm'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="block font-bold text-base text-slate-900">
                  I Lost Something
                </span>
                <span className="text-xs text-slate-500 leading-relaxed mt-0.5 block">
                  Report a personal belonging you misplaced or lost inside the university campus.
                </span>
              </div>
            </button>

            {/* I Found Something Option */}
            <button
              type="button"
              onClick={() => setReportType('FOUND')}
              className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${
                reportType === 'FOUND'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  reportType === 'FOUND'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="block font-bold text-base text-slate-900">
                  I Found Something
                </span>
                <span className="text-xs text-slate-500 leading-relaxed mt-0.5 block">
                  Report an item you discovered on campus so its rightful owner can reclaim it.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* SECTION B: ITEM INFORMATION */}
        <div className="pt-6 border-t border-slate-100 space-y-6">
          <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-navy-100 text-navy-800 text-xs flex items-center justify-center font-bold">1</span>
            <span>Item Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Title / Item Name */}
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Item Name / Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Black Leather Tommy Hilfiger Wallet, iPhone 14 Pro, Toyota Car Key"
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.title
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-navy-600'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-rose-600 font-medium mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-navy-600" />
                <span>Category</span> <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Lost/Found */}
            <div>
              <label htmlFor="itemDate" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-navy-600" />
                <span>{reportType === 'LOST' ? 'Date Lost' : 'Date Found'}</span>{' '}
                <span className="text-rose-500">*</span>
              </label>
              <input
                id="itemDate"
                type="date"
                max={todayStr}
                value={itemDate}
                onChange={(e) => setItemDate(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.itemDate
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-navy-600'
                }`}
              />
              {errors.itemDate && (
                <p className="text-xs text-rose-600 font-medium mt-1">{errors.itemDate}</p>
              )}
            </div>

            {/* Location */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="location" className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-navy-600" />
                  <span>Campus Location</span> <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomLocation(!isCustomLocation)}
                  className="text-xs font-semibold text-navy-700 hover:underline"
                >
                  {isCustomLocation ? 'Select from standard locations' : 'Enter custom campus location'}
                </button>
              </div>

              {isCustomLocation ? (
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="e.g. Outside Building D near the water fountain"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition-all"
                />
              ) : (
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition-all"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              )}
              {errors.location && (
                <p className="text-xs text-rose-600 font-medium mt-1">{errors.location}</p>
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Description &amp; Identifying Features <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe color, brand, unique scratches, stickers, contents, or circumstances where it was lost/found..."
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.description
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-navy-600'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-600 font-medium mt-1">{errors.description}</p>
              )}
            </div>

          </div>
        </div>

        {/* SECTION C: IMAGE UPLOAD */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-navy-100 text-navy-800 text-xs flex items-center justify-center font-bold">2</span>
              <span>Upload Photo</span>
            </h2>
            <span className="text-xs text-slate-400">Optional</span>
          </div>

          <ImageUpload
            file={imageFile}
            onChange={(f) => setImageFile(f)}
          />
        </div>

        {/* SECTION D: CONTACT INFORMATION */}
        <div className="pt-6 border-t border-slate-100 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-navy-100 text-navy-800 text-xs flex items-center justify-center font-bold">3</span>
              <span>Your Contact Information</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              This information will be displayed to allow owners to reach out. No account or password is created.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Contact Name */}
            <div>
              <label htmlFor="contactName" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-navy-600" />
                <span>Full Name</span> <span className="text-rose-500">*</span>
              </label>
              <input
                id="contactName"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Omar Hassan"
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.contactName
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-navy-600'
                }`}
              />
              {errors.contactName && (
                <p className="text-xs text-rose-600 font-medium mt-1">{errors.contactName}</p>
              )}
            </div>

            {/* Contact Email */}
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-navy-600" />
                <span>Email Address</span> <span className="text-rose-500">*</span>
              </label>
              <input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. omar.hassan@student.aast.edu"
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.contactEmail
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-navy-600'
                }`}
              />
              {errors.contactEmail && (
                <p className="text-xs text-rose-600 font-medium mt-1">{errors.contactEmail}</p>
              )}
            </div>

            {/* Contact Phone (Optional) */}
            <div className="sm:col-span-2">
              <label htmlFor="contactPhone" className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-navy-600" />
                  <span>Phone Number</span>
                </span>
                <span className="text-xs text-slate-400 font-normal">Optional</span>
              </label>
              <input
                id="contactPhone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +20 10 1234 5678"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition-all"
              />
            </div>

          </div>
        </div>

        {/* SECTION E: SUBMIT BUTTON */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            By submitting, you agree to post this report publicly on the university directory.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-navy-950 bg-gold-400 hover:bg-gold-500 active:bg-gold-600 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base shrink-0"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Publishing Report...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
