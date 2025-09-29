# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

import logging
from typing import Optional

from flask import g, redirect, request, session
from flask_appbuilder import expose
from flask_appbuilder.const import LOGMSG_ERR_SEC_NO_REGISTER_HASH
from flask_appbuilder.security.decorators import no_cache
from flask_appbuilder.security.views import AuthView, WerkzeugResponse
from flask_appbuilder.utils.base import get_safe_redirect
from flask_babel import lazy_gettext

from superset.views.base import BaseSupersetView

logger = logging.getLogger(__name__)


class SupersetAuthView(BaseSupersetView, AuthView):
    route_base = "/login"

    @expose("/")
    @no_cache
    def login(self, provider: Optional[str] = None) -> WerkzeugResponse:
        if g.user is not None and g.user.is_authenticated:
            # Check if there's a stored redirect URL from OAuth flow
            if 'next_url' in session:
                next_url = session.pop('next_url')
                return redirect(next_url)
            return redirect(self.appbuilder.get_url_for_index)

        # If a provider is specified, this might be an OAuth callback
        # Let the parent handle OAuth/OpenID authentication  
        if provider is not None:
            return super().login(provider)
            
        return super().render_app_template()

    @expose("/<provider>")
    @no_cache
    def provider_login(self, provider: str) -> WerkzeugResponse:
        """Handle OAuth/OpenID provider login while preserving redirect parameters.
        
        This endpoint captures the 'next' parameter from the query string and stores it
        in the session before redirecting to the actual Flask-AppBuilder OAuth/OpenID
        login handler. After successful authentication, the parent AuthView will use
        this stored value for redirection.
        """
        # Store the 'next' parameter in session for use after OAuth flow completes
        next_url = request.args.get('next')
        if next_url:
            # Validate the redirect URL for security
            safe_next_url = get_safe_redirect(next_url)
            if safe_next_url:
                session['next_url'] = safe_next_url
        
        # Delegate to parent AuthView's OAuth/OpenID login handling
        # Flask-AppBuilder will handle the actual OAuth flow
        return super().login(provider)


class SupersetRegisterUserView(BaseSupersetView):
    route_base = "/register"
    activation_template = ""
    error_message = lazy_gettext(
        "Not possible to register you at the moment, try again later"
    )
    false_error_message = lazy_gettext("Registration not found")

    @expose("/")
    @no_cache
    def register(self) -> WerkzeugResponse:
        return super().render_app_template()

    @expose("/activation/<string:activation_hash>")
    def activation(self, activation_hash: str) -> WerkzeugResponse:
        """
        Endpoint to expose an activation url, this url
        is sent to the user by email, when accessed the user is inserted
        and activated
        """
        reg = self.appbuilder.sm.find_register_user(activation_hash)
        if not reg:
            logger.error(LOGMSG_ERR_SEC_NO_REGISTER_HASH, activation_hash)
            logger.error("Registration activation failed: %s", self.false_error_message)
            return redirect(self.appbuilder.get_url_for_index)
        if not self.appbuilder.sm.add_user(
            username=reg.username,
            email=reg.email,
            first_name=reg.first_name,
            last_name=reg.last_name,
            role=self.appbuilder.sm.find_role(
                self.appbuilder.sm.auth_user_registration_role
            ),
            hashed_password=reg.password,
        ):
            logger.error("User registration failed: %s", self.error_message)
            return redirect(self.appbuilder.get_url_for_index)
        else:
            self.appbuilder.sm.del_register_user(reg)
            return super().render_app_template(
                {
                    "username": reg.username,
                    "first_name": reg.first_name,
                    "last_name": reg.last_name,
                },
            )
