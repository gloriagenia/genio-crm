"use client";

import {
  Calendar,
  MapPin,
  Phone,
  Home,
  ExternalLink,
} from "lucide-react";

import CanvassingStatusBadge
from "./CanvassingStatusBadge";

import CanvassingActionMenu
from "./CanvassingActionMenu";

type CanvassingCardProps = {
  item: any;

  onEdit?: (
    item: any
  ) => void;

  onCreateProperty?: (
    item: any
  ) => void;

  onRefresh?: () => void;

  onClick?: (
    item: any
  ) => void;
};

export default function CanvassingCard({
  item,
  onEdit,
  onCreateProperty,
  onRefresh,
  onClick,
}: CanvassingCardProps) {

  return (

    <div
      onClick={() =>
        onClick?.(item)
      }
      className="
        bg-white
        border
        rounded-2xl
        p-4
        md:p-5

        cursor-pointer

        hover:shadow-md
        transition
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        <div
          className="
            flex-1
            min-w-0
          "
        >

          {/* NAME + STATUS */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >

            <h3
              className="
                font-semibold
                text-base
                md:text-lg
                truncate
              "
            >
              {item.name ||
                "No Name"}
            </h3>

            <CanvassingStatusBadge
              status={
                item.status
              }
            />

          </div>

          {/* PHONE */}

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-gray-500
              mt-1
            "
          >

            <Phone
              size={14}
            />

            <span>
              {item.phone ||
                "-"}
            </span>

          </div>

        </div>

        {/* ACTION */}

        <div
          onClick={(e) =>
            e.stopPropagation()
          }
        >

          <CanvassingActionMenu
            item={item}
            onEdit={onEdit}
            onCreateProperty={
              onCreateProperty
            }
            onRefresh={
              onRefresh
            }
          />

        </div>

      </div>

      {/* INFO */}

      <div
        className="
          mt-4

          flex
          flex-col

          md:flex-row
          md:flex-wrap

          gap-3
          md:gap-6

          text-sm
        "
      >

        {/* PROPERTY */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <Home
            size={15}
            className="
              text-gray-500
            "
          />

          <span>
            {item.property_type ||
              "-"}
          </span>

        </div>

        {/* LOCATION */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <MapPin
            size={15}
            className="
              text-gray-500
            "
          />

          <span>

            {[
              item.district,
              item.city,
            ]
              .filter(Boolean)
              .join(", ") || "-"}

          </span>

        </div>

        {/* DATE */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <Calendar
            size={15}
            className="
              text-gray-500
            "
          />

          <span>
            {item.canvassing_date ||
              "-"}
          </span>

        </div>

      </div>

      {/* FOOTER */}

      <div
        className="
          mt-4
          pt-4
          border-t

          flex
          flex-col

          md:flex-row
          md:items-center
          md:justify-between

          gap-3
        "
      >

        {/* LT LB */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2

            text-sm
          "
        >

          {item.land_size && (

            <span>
              LT {item.land_size} m²
            </span>

          )}

          {item.land_size &&
            item.building_size && (
            <span>
              •
            </span>
          )}

          {item.building_size && (

            <span>
              LB {item.building_size} m²
            </span>

          )}

        </div>

        {/* PHOTO LINK */}

        {item.photo_url && (

          <a
            href={
              item.photo_url
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              inline-flex
              items-center
              gap-2

              text-sm
              font-medium

              text-blue-600
              hover:text-blue-800
              hover:underline
            "
          >

            View Photo

            <ExternalLink
              size={14}
            />

          </a>

        )}

      </div>

    </div>

  );
}