"use client";

import { useFormState } from "react-dom";
// import { updateUserInfo } from "@/app/actions/updateUser";

export default function ProfileForm({
  defaultValues,
}: {
  defaultValues: { firstName: string; lastName: string; email: string };
}) {
  const [state, formAction] = useFormState(null, null);

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      <div>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          defaultValue={defaultValues.firstName}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div>
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          defaultValue={defaultValues.lastName}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          defaultValue={defaultValues.email}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>

      {state && <p className="text-red-500 text-sm mt-2">{state}</p>}
    </form>
  );
}
