"use client"
import React, { useState } from 'react';
import { Plus, X, Calendar, DollarSign, Building, FileText, Users, Globe, Tag, Clock } from 'lucide-react';
import AddFieldModal from '@/components/AddFieldModal';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/authcontext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


interface FormData {
  grantName: string;
  organization: string;
  shortDescription: string;
  fullDescription: string;
  amount: string;
  currency: string;
  deadline: string;
  applicationDeadline: string;
  category: string;
  eligibility: string;
  requirements: string[];
  benefits: string[];
  applicationProcess: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  tags: string[];
  status: 'Draft' | 'Open' | 'Closed' | 'Review';
  maxApplications: string;
  targetAudience: string;
  geographicScope: string;
  fundingType: string;
  duration: string;
  renewability: string;
}

interface CustomField {
  name: string;
  value: string;
  type: string;
}

const CreateGrantsPage = () => {
  const [formData, setFormData] = useState<FormData>({
    grantName: '',
    organization: '',
    shortDescription: '',
    fullDescription: '',
    amount: '',
    currency: 'USD',
    deadline: '',
    applicationDeadline: '',
    category: '',
    eligibility: '',
    requirements: [''],
    benefits: [''],
    applicationProcess: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    tags: [''],
    status: 'Draft',
    maxApplications: '',
    targetAudience: '',
    geographicScope: '',
    fundingType: 'Grant',
    duration: '',
    renewability: 'Non-renewable'
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth(); 
  const router = useRouter(); 


  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof FormData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: keyof FormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: keyof FormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const addCustomField = (fieldName: string, fieldType: string) => {
    setCustomFields(prev => [...prev, { name: fieldName, value: '', type: fieldType }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(prev => prev.filter((_, i) => i !== index));
  };

  const updateCustomField = (index: number, value: string) => {
    setCustomFields(prev => prev.map((field, i) => 
      i === index ? { ...field, value } : field
    ));
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (!user) {
        toast.error("You must be logged in as an admin to create a grant.");
        return;
    }
    
    setIsSubmitting(true);
    const loadingToast = toast.loading("Creating grant...");

    try {
        const grantData = {
            ...formData,
            customFields, 
            // Filter out empty strings from arrays before saving
            requirements: formData.requirements.filter(req => req.trim() !== ''),
            benefits: formData.benefits.filter(ben => ben.trim() !== ''),
            tags: formData.tags.filter(tag => tag.trim() !== ''),
            // Add metadata
            createdBy: user.uid,
            authorName: user.displayName || 'Admin',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        // Add the new document to the 'grants' collection
        await addDoc(collection(db, "grants"), grantData);

        toast.success("Grant created successfully!", { id: loadingToast });
        
        // Redirect to the manage grants page
        router.push('/admin/manage-grants');

    } catch (error) {
        console.error("Error creating grant: ", error);
        toast.error("Failed to create grant. Please try again.", { id: loadingToast });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Grants</h1>
        <p className="text-gray-600 mt-1">Add grants users can have access to</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grant Name *</label>
              <input
                type="text"
                value={formData.grantName}
                onChange={(e) => handleInputChange('grantName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Enter grant name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization *</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Enter organization name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Brief description of the grant"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
              <textarea
                value={formData.fullDescription}
                onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Detailed description of the grant program"
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Grant amount"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="NGN">NGN</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Funding Type</label>
              <select
                value={formData.fundingType}
                onChange={(e) => handleInputChange('fundingType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="Grant">Grant</option>
                <option value="Loan">Loan</option>
                <option value="Investment">Investment</option>
                <option value="Scholarship">Scholarship</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline *</label>
              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="e.g., 12 months"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Renewability</label>
              <select
                value={formData.renewability}
                onChange={(e) => handleInputChange('renewability', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="Non-renewable">Non-renewable</option>
                <option value="Renewable">Renewable</option>
                <option value="Multi-year">Multi-year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Eligibility & Requirements */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Eligibility & Requirements</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="e.g., Small businesses, Startups, Non-profits"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Scope</label>
              <input
                type="text"
                value={formData.geographicScope}
                onChange={(e) => handleInputChange('geographicScope', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="e.g., National, Regional, Global"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria</label>
              <textarea
                value={formData.eligibility}
                onChange={(e) => handleInputChange('eligibility', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Detailed eligibility requirements"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Requirements</label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Enter requirement"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Requirement</span>
              </button>
            </div>
          </div>
        </div>

        {/* Benefits & Process */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Benefits & Application Process</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Benefits/What's Offered</label>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Enter benefit"
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('benefits', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('benefits')}
                className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Benefit</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Process</label>
              <textarea
                value={formData.applicationProcess}
                onChange={(e) => handleInputChange('applicationProcess', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Describe the application process step by step"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Applications</label>
              <input
                type="number"
                value={formData.maxApplications}
                onChange={(e) => handleInputChange('maxApplications', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Leave blank for unlimited"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="contact@organization.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="https://organization.com"
              />
            </div>
          </div>
        </div>

        {/* Categories & Tags */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories & Tags</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Environment">Environment</option>
                <option value="Arts">Arts</option>
                <option value="Business">Business</option>
                <option value="Research">Research</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Review">Under Review</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Enter tag"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tags', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('tags')}
                className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tag</span>
              </button>
            </div>
          </div>
        </div>

        {/* Custom Fields */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Custom Fields</h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Field</span>
            </button>
          </div>
          
          {customFields.length === 0 ? (
            <p className="text-gray-500 text-sm">No custom fields added yet. Click "Add Field" to create additional fields.</p>
          ) : (
            <div className="space-y-4">
              {customFields.map((field, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.name}</label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => updateCustomField(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder={`Enter ${field.name.toLowerCase()}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCustomField(index)}
                    className="text-red-500 hover:text-red-700 mt-6"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="submit" 
            disabled={isSubmitting} 
            onClick={handleSubmit}
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? "Creating..." : "Add Grant"}</span>
          </button>
        </div>
      </div>
      </form>

      {/* Add Field Modal */}
      <AddFieldModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addCustomField}
      />
    </div>
  );
};

export default CreateGrantsPage;