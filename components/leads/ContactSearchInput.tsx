"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Loader2,
  Search,
  UserRound,
  X,
} from "lucide-react";

import clsx from "clsx";

import { supabase } from "@/lib/supabase";

// =========================
// TYPES
// =========================

type Contact = {
  contact_id: number;

  name: string;

  phone: string;
};

type ContactSearchInputProps = {
  value?: number | null;

  onSelect: (
    contact: Contact | null
  ) => void;

  placeholder?: string;

  disabled?: boolean;
};

export default function ContactSearchInput({
  value,
  onSelect,
  placeholder = "Search contact name or phone...",
  disabled = false,
}: ContactSearchInputProps) {

  // =========================
  // STATES
  // =========================

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    contacts,
    setContacts,
  ] = useState<Contact[]>([]);

  const [
    selectedContact,
    setSelectedContact,
  ] = useState<Contact | null>(
    null
  );

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  // =========================
  // FETCH SELECTED
  // =========================

  useEffect(() => {

    async function fetchSelected() {

      if (!value) {

        setSelectedContact(
          null
        );

        return;
      }

      const {
        data,
        error,
      } = await supabase

        .from("contacts")

        .select(`
          contact_id,
          name,
          phone
        `)

        .eq(
          "contact_id",
          value
        )

        .single();

      if (error) {

        console.log(error);

        return;
      }

      if (data) {

        setSelectedContact(
          data
        );

        setQuery(
          data.name || ""
        );
      }
    }

    fetchSelected();

  }, [value]);

  // =========================
  // SEARCH CONTACTS
  // =========================

  useEffect(() => {

    async function searchContacts() {

      try {

        setLoading(true);

        let queryBuilder =
          supabase

            .from("contacts")

            .select(`
              contact_id,
              name,
              phone
            `)

            .order(
              "name",
              {
                ascending: true,
              }
            )

            .limit(30);

        // =====================
        // SEARCH FILTER
        // =====================

        if (
          query &&
          query.trim().length > 0
        ) {

          queryBuilder =
            queryBuilder.or(
              `name.ilike.%${query}%,phone.ilike.%${query}%`
            );
        }

        const {
          data,
          error,
        } = await queryBuilder;

        if (error) {

          console.log(error);

          return;
        }

        setContacts(
          data || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    }

    const delay =
      setTimeout(() => {

        searchContacts();

      }, 300);

    return () =>
      clearTimeout(delay);

  }, [query]);

  // =========================
  // CLICK OUTSIDE
  // =========================

  useEffect(() => {

    function handleClickOutside(
      event: MouseEvent
    ) {

      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {

        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  // =========================
  // CLEAR
  // =========================

  function handleClear() {

    setSelectedContact(
      null
    );

    setQuery("");

    setContacts([]);

    onSelect(null);
  }

  // =========================
  // FILTERED CONTACTS
  // =========================

  const filteredContacts =
    useMemo(() => {

      if (!query) return [];

      return contacts.filter(
        (contact) => {

          const keyword =
            query.toLowerCase();

          return (

            contact.name
              ?.toLowerCase()
              .includes(keyword)

            ||

            contact.phone
              ?.toLowerCase()
              .includes(keyword)
          );
        }
      );

    }, [
      contacts,
      query,
    ]);

  return (

    <div
      ref={wrapperRef}
      className="
        relative
        w-full
      "
    >

      {/* INPUT */}

      <div
        className={clsx(
          `
            flex
            h-12
            items-center
            gap-3

            rounded-2xl

            border
            border-slate-200

            bg-white

            px-4

            transition-all

            focus-within:border-violet-400
            focus-within:ring-4
            focus-within:ring-violet-100
          `,
          disabled &&
            `
              opacity-50
              pointer-events-none
            `
        )}
      >

        <Search
          size={18}
          className="
            shrink-0
            text-slate-400
          "
        />

        <input
          type="text"

          value={query}

          disabled={disabled}

          placeholder={placeholder}

          onFocus={() =>
            setOpen(true)
          }

          onChange={(e) => {

            setQuery(
              e.target.value
            );

            setOpen(true);
          }}

          className="
            flex-1

            bg-transparent

            text-[15px]

            outline-none

            placeholder:text-slate-400
          "
        />

        {loading && (

          <Loader2
            size={16}
            className="
              animate-spin
              text-violet-600
            "
          />

        )}

        {!loading &&
          selectedContact && (

            <button
              type="button"

              onClick={
                handleClear
              }

              className="
                rounded-full

                p-1

                text-slate-400

                hover:bg-slate-100
              "
            >

              <X size={14} />

            </button>

          )}

      </div>

      {/* DROPDOWN */}

      {open && (

        <div
          className="
            absolute
            left-0
            right-0
            z-[99999]

            mt-2

            overflow-hidden

            rounded-2xl

            border
            border-slate-200

            bg-white

            shadow-2xl
          "
        >

          {/* EMPTY */}

          {!loading &&
            filteredContacts.length ===
              0 && (

              <div
                className="
                  px-4
                  py-6

                  text-center

                  text-sm
                  text-slate-500
                "
              >
                No contacts found
              </div>

            )}

          {/* LIST */}

          <div
            className="
              max-h-[300px]
              overflow-y-auto
            "
          >

            {filteredContacts.map(
              (contact) => (

                <button
                  key={
                    contact.contact_id
                  }

                  type="button"

                  onClick={() => {

                    setSelectedContact(
                      contact
                    );

                    setQuery(
                      contact.name
                    );

                    setOpen(
                      false
                    );

                    onSelect(
                      contact
                    );
                  }}

                  className="
                    flex
                    w-full
                    items-center
                    gap-3

                    border-b
                    border-slate-100

                    px-4
                    py-3

                    text-left

                    transition-all

                    hover:bg-violet-50
                  "
                >

                  {/* AVATAR */}

                  <div
                    className="
                      flex
                      h-10
                      w-10

                      shrink-0

                      items-center
                      justify-center

                      rounded-full

                      bg-violet-100

                      text-sm
                      font-semibold

                      text-violet-700
                    "
                  >

                    {contact.name?.charAt(
                      0
                    ) || (
                      <UserRound
                        size={16}
                      />
                    )}

                  </div>

                  {/* INFO */}

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >

                    <p
                      className="
                        truncate

                        font-medium

                        text-slate-900
                      "
                    >
                      {contact.name}
                    </p>

                    <p
                      className="
                        mt-0.5

                        truncate

                        text-sm

                        text-slate-500
                      "
                    >
                      {contact.phone}
                    </p>

                  </div>

                </button>

              )
            )}

          </div>

        </div>

      )}

    </div>
  );
}