import React, { useEffect } from 'react';
import { X, MapPin, Calendar, Tag, Mail, Phone, User, CheckCircle2, Package, ShieldCheck } from 'lucide-react';
import { Item } from '../../types/item';
import { getFullImageUrl } from '../../services/api';

interface ItemDetailsModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  // Prevent background scrolling when open & handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const imageUrl = getFullImageUrl(item.image_url);
  const isLost = item.type === 'LOST';
  const isReturned = item.status === 'RETURNED';

  const formattedDate = new Date(item.item_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const reportedOn = new Date(item.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-8">
        
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 shadow-md backdrop-blur-xs transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-navy-600"
          aria-label="Close details modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Media */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-100 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 text-slate-400 p-6">
              <Package className="w-16 h-16 stroke-[1.25] text-slate-400/80 mb-2" />
              <p className="text-sm font-medium text-slate-500">No image attached to this report</p>
            </div>
          )}

          {/* Badges on Image */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-md ${
                isLost
                  ? 'bg-amber-500 text-navy-950 ring-2 ring-amber-600/30'
                  : 'bg-emerald-600 text-white ring-2 ring-emerald-700/30'
              }`}
            >
              {item.type} ITEM
            </span>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 ${
                isReturned
                  ? 'bg-slate-900/90 text-emerald-400 backdrop-blur-xs'
                  : 'bg-white/95 text-slate-700 backdrop-blur-xs'
              }`}
            >
              {isReturned ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  RETURNED TO OWNER
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  ACTIVE CASE (OPEN)
                </>
              )}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Title and Category */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-navy-600 uppercase tracking-wider mb-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>{item.category}</span>
            </div>
            <h2 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              {item.title}
            </h2>
          </div>

          {/* Key Facts Pills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-navy-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-medium text-slate-500">Campus Location</span>
                <span className="font-semibold text-slate-900">{item.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-navy-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-medium text-slate-500">{isLost ? 'Date Lost' : 'Date Found'}</span>
                <span className="font-semibold text-slate-900">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Item Description & Identifying Marks
            </h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
              {item.description}
            </p>
          </div>

          {/* Contact Information Card */}
          <div className="border border-navy-100 rounded-2xl p-5 bg-gradient-to-br from-navy-50/70 via-slate-50 to-white">
            <div className="flex items-center gap-2 text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-navy-700" />
              <span>Contact Person Information</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-navy-100 text-navy-800 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Name</span>
                  <span className="font-semibold text-slate-900">{item.contact_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-navy-100 text-navy-800 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="block text-xs text-slate-500">Email Address</span>
                  <a
                    href={`mailto:${item.contact_email}?subject=Regarding Lost and Found Report: ${encodeURIComponent(item.title)}`}
                    className="font-medium text-navy-700 hover:text-navy-950 underline underline-offset-2 truncate"
                  >
                    {item.contact_email}
                  </a>
                </div>
              </div>

              {item.contact_phone && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-navy-100 text-navy-800 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500">Phone Number</span>
                    <a
                      href={`tel:${item.contact_phone}`}
                      className="font-medium text-navy-700 hover:text-navy-950 underline underline-offset-2"
                    >
                      {item.contact_phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer note & Close */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span>Report registered into system on {reportedOn}</span>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
