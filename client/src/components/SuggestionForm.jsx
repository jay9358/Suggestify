import { useState } from 'react';

export default function SuggestionForm({ onSubmit, initialData = {}, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    tags: initialData.tags?.join(', ') || '',
    attachments: initialData.attachments?.join(', ') || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (formData.title.length > 150) {
      newErrors.title = 'Title cannot exceed 150 characters';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const attachments = formData.attachments
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags,
      attachments
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          maxLength={150}
          className={`input-field ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Enter suggestion title"
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.title}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.title.length}/150 characters
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className={`input-field ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Describe your suggestion in detail"
          aria-required="true"
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter tags separated by commas (e.g., feature, improvement)"
        />
        <p className="mt-1 text-xs text-gray-500">
          Separate multiple tags with commas
        </p>
      </div>

      <div>
        <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">
          Attachments (URLs)
        </label>
        <input
          type="text"
          id="attachments"
          name="attachments"
          value={formData.attachments}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter URLs separated by commas"
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter valid URLs separated by commas
        </p>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Suggestion'}
        </button>
      </div>
    </form>
  );
}

